import { EmbeddingsInterface } from "@langchain/core/embeddings";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export class PineconeManager {
    private readonly pinecone: Pinecone;

    constructor() {
        this.pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });
    }

    private async getIndex() {
        return this.pinecone.index(process.env.PINECONE_INDEX!);
    }

    async getVectorStore(embeddings: EmbeddingsInterface, namespace?: string) {
        const index = await this.getIndex();

        return await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            namespace: namespace
        });
    }
}
