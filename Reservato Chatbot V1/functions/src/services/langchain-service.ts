import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getRecommendationSystemPrompt } from '../llm/prompts/recommendation-system-prompt';

export class LangchainService {
    async getResponse(query: string) {

        const llm = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0,
            openAIApiKey: process.env.OPENAI_API_KEY!
        });

        const pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });

        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-large",
            openAIApiKey: process.env.OPENAI_API_KEY!
        });

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: pinecone.Index(process.env.PINECONE_INDEX!),
        });

        const similarRecords = await vectorStore.similaritySearch(query);

        const messages = [
            new SystemMessage(getRecommendationSystemPrompt()),
            new AIMessage(`Context: ${JSON.stringify(similarRecords)}`),
            new HumanMessage(query),
        ];
        
        const result = await llm.invoke(messages);
        return result.text;
    }
}
