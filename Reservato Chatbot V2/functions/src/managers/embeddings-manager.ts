import { MistralAIEmbeddings } from "@langchain/mistralai";

export class EmbeddingsManager {
    private readonly embeddings: MistralAIEmbeddings;

    constructor() {
        this.embeddings = new MistralAIEmbeddings({
            apiKey: process.env.MISTRAL_API_KEY,
            model: "mistral-embed"
        });
    }

    async getEmbeddings() {
        return this.embeddings;
    }
}
