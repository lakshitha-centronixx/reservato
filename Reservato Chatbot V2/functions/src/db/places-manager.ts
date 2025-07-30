import { PineconeStore } from "@langchain/pinecone";
import { EmbeddingsManager } from "../managers/embeddings-manager";
import { PineconeManager } from "../managers/pinecone-manager";

export class PlacesManager {
    private vectorStore!: PineconeStore;

    public static async create(): Promise<PlacesManager> {
        const manager = new PlacesManager();
        await manager.init();
        return manager;
    }

    private async init() {
        const pineconeManager = new PineconeManager();
        const embeddingsManager = new EmbeddingsManager();

        const embeddings = await embeddingsManager.getEmbeddings();
        this.vectorStore = await pineconeManager.getVectorStore(embeddings);
    }

    private getVectorStore(): PineconeStore {
        if (!this.vectorStore) {
            throw new Error("PlacesManager not initialized properly.");
        }
        return this.vectorStore;
    }

    async getPlacesDetails(placeId: string) {
        const vectorStore = this.getVectorStore();
        const results = await vectorStore.similaritySearch(placeId, 1, { "identification_googlePlaceId": { "$eq": placeId } });
        return results[0] || { "id": null, "pageContent": null, "metadata": null };
    }
}
