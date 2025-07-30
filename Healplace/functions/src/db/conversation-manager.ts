import { PineconeManager } from "../managers/pinecone-manager";
import { EmbeddingsManager } from "../managers/embeddings-manager";
import { PineconeStore } from "@langchain/pinecone";

export class ConversationManager {
    private vectorStore!: PineconeStore;

    public static async create(): Promise<ConversationManager> {
        const manager = new ConversationManager();
        await manager.init();
        return manager;
    }

    private async init() {
        const pineconeManager = new PineconeManager();
        const embeddingsManager = new EmbeddingsManager();

        const embeddings = await embeddingsManager.getEmbeddings();
        this.vectorStore = await pineconeManager.getVectorStore(embeddings, "chat_history");
    }

    private getVectorStore(): PineconeStore {
        if (!this.vectorStore) {
            throw new Error("ConversationManager not initialized properly.");
        }
        return this.vectorStore;
    }

    async saveMemory(sessionId: string, query: string, aiResponse: string) {

        const vectorStore = this.getVectorStore();

        const memoryContent = `Human: ${query} \n AI Response: ${aiResponse}`;

        const memoryDoc = {
            pageContent: memoryContent,
            metadata: {
                sessionId: sessionId,
                human: query,
                ai: aiResponse,
                timestamp: new Date().toISOString()
            }
        };

        await vectorStore.addDocuments([memoryDoc]);
    }

    async getConversationHistory(sessionId: string, query: string): Promise<[string, string][]> {

        const vectorStore = this.getVectorStore();
        const results = await vectorStore.similaritySearch(query, 5, { "sessionId": { "$eq": sessionId } });

        const sortedDocs = [...results];

        sortedDocs.sort((a, b) => {
            const tsA = new Date(a.metadata?.timestamp ?? 0).getTime();
            const tsB = new Date(b.metadata?.timestamp ?? 0).getTime();
            return tsA - tsB;
        });

        const history: [string, string][] = [];

        for (const doc of sortedDocs) {
            const human = doc.metadata?.human;
            const ai = doc.metadata?.ai;

            const isValidHuman = typeof human === "string" && human.trim();
            const isValidAi = typeof ai === "string" && ai.trim();

            if (isValidHuman && isValidAi) {
                history.push(["human", human]);
                history.push(["ai", ai]);
            }
        }

        return history;
    }
}