import { LlmManager } from '../managers/llm-manager';
import { getRecommendationSystemPrompt } from '../llm/prompts/recommendation-system-prompt';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableParallel, RunnableSequence } from "@langchain/core/runnables";
import { RecommendationResponse } from "../llm/schema/recommendation-schema";
import { PineconeManager } from '../managers/pinecone-manager';
import { EmbeddingsManager } from '../managers/embeddings-manager';
import { ConversationManager } from '../db/conversation-manager';
import { Document } from 'langchain/document';
import { ISystemPromptInstructions } from '../helpers/interfaces';

export class LangchainService {
    async getResponse(date: string, sessionId: string, query: string, systemPromptInstructions: ISystemPromptInstructions) {
        const llmManager = new LlmManager();
        const pineconeManager = new PineconeManager();
        const embeddingsManager = new EmbeddingsManager();

        const conversationManager = await ConversationManager.create(date);

        const llm = await llmManager.getRecommendationModel();
        const embeddings = await embeddingsManager.getEmbeddings();
        const ragVectorStore = await pineconeManager.getVectorStore(embeddings, "v0");

        const ragRetriever = ragVectorStore.asRetriever({ k: 10 });

        const combinedRetriever = RunnableParallel.from({
            rag_docs: ragRetriever,
        });

        const systemPromptContent = getRecommendationSystemPrompt(systemPromptInstructions);

        console.log("System instructions " + systemPromptContent);

        const chatHistory = await conversationManager.getConversationHistory(sessionId, query);

        console.log("Chat history " + JSON.stringify(chatHistory));

        const chatPrompt = ChatPromptTemplate.fromMessages([
            ["system", systemPromptContent],
            ...chatHistory,
            ["human", "{input}"],
        ]);

        const structuredOutputChain = RunnableSequence.from([
            {
                context: RunnableSequence.from([
                    (input) => input.input,
                    combinedRetriever,
                    (retrieverOutput) => {
                        let formattedDocs = "";
                        retrieverOutput.rag_docs.forEach((doc: Document, index: number) => {
                            formattedDocs += `Document ${index + 1}:\n`;
                            formattedDocs += `${JSON.stringify(doc.metadata)}\n\n`;
                        });
                        console.log("Context" + JSON.stringify(formattedDocs))
                        return `Context:\n${formattedDocs}`;
                    },
                ]),
                input: (input) => input.input,
                chat_history: (input) => input.chat_history,
            },
            chatPrompt,
            llm,
        ]);

        try {
            const stream = structuredOutputChain.stream({
                input: query
            });

            let fullResult: RecommendationResponse = { text: "" };

            const processStream = (async function* () {
                for await (const chunk of await stream) {
                    if (chunk.text) {
                        fullResult.text += chunk.text;
                    }
                    yield chunk;
                }

                console.log("Result " + JSON.stringify(fullResult));
                await conversationManager.saveMemory(sessionId, query, fullResult.text);
            })();

            if (!(Symbol.asyncIterator in processStream)) {
                console.error("CRITICAL ERROR: processStream is not an AsyncIterable!");
                return "An error occurred while getting help";
            }

            return processStream;
        } catch (error) {
            console.error("Error getting LLM response:", error);
            return "An error occurred while getting help";
        }
    }
}