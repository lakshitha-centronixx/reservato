import { LlmManager } from '../managers/llm-manager';
import { getRecommendationSystemPrompt } from '../llm/prompts/recommendation-system-prompt';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableParallel, RunnableSequence } from "@langchain/core/runnables";
import { RecommendationResponse } from "../llm/schema/langchain-recommendation-schema";
import { PineconeManager } from '../managers/pinecone-manager';
import { EmbeddingsManager } from '../managers/embeddings-manager';
import { ConversationManager } from '../db/conversation-manager';
import { Document } from 'langchain/document';
import { formatResponseToString } from '../helpers/format-response';

export class LangchainService {
    async getResponse(date: string, sessionId: string, query: string): Promise<RecommendationResponse> {
        const llmManager = new LlmManager();
        const pineconeManager = new PineconeManager();
        const embeddingsManager = new EmbeddingsManager();

        const conversationManager = await ConversationManager.create(date);

        const llm = await llmManager.getRecommendationModel();
        const embeddings = await embeddingsManager.getEmbeddings();
        const ragVectorStore = await pineconeManager.getVectorStore(embeddings);

        const ragRetriever = ragVectorStore.asRetriever({ k: 10 });

        const combinedRetriever = RunnableParallel.from({
            rag_docs: ragRetriever,
        });

        const systemPromptContent = getRecommendationSystemPrompt();

        console.log("System instructions: " + systemPromptContent);

        const chatHistory = await conversationManager.getConversationHistory(sessionId, query);

        console.log("Sorted chat history: " + JSON.stringify(chatHistory));

        const chatPrompt = ChatPromptTemplate.fromMessages([
            ["system", systemPromptContent],
            ...chatHistory,
            ["human", "{input}"],
        ]);

        console.log("Chat prompt: " + JSON.stringify(chatPrompt))

        const structuredOutputChain = RunnableSequence.from([
            {
                context: RunnableSequence.from([
                    (input) => input.input,
                    combinedRetriever,
                    (retrieverOutput) => {
                        let formattedDocs = "";
                        retrieverOutput.rag_docs.forEach((doc: Document, index: number) => {
                            formattedDocs += `Restaurant ${index + 1}:\n`;
                            formattedDocs += `${JSON.stringify(doc.metadata)}\n\n`;
                        });
                        console.log("Context: " + JSON.stringify(formattedDocs))
                        return `Context:\n${formattedDocs}`;
                    },
                ]),
                input: (input) => input.input,
            },
            chatPrompt,
            llm,
        ]);

        try {
            const result = await structuredOutputChain.invoke({
                input: query
            });

            console.log("Result: " + JSON.stringify(result));

            const formattedAiMessage = formatResponseToString(result);

            await conversationManager.saveMemory(sessionId, query, formattedAiMessage);

            return result;
        } catch (error) {
            console.error("Error getting LLM response:", error);
            return {
                text: "An error occurred while getting recommendations",
                recommendations: []
            };
        }
    }
}