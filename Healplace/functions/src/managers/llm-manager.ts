import { ChatMistralAI } from "@langchain/mistralai";

export class LlmManager {
    private readonly client: ChatMistralAI;

    constructor() {
        this.client = new ChatMistralAI({
            apiKey: process.env.MISTRAL_API_KEY,
            modelName: "mistral-small-2506",
            maxTokens: 128000,
            streaming: true
        });
    }

    async getRecommendationModel() {
        return this.client;
    }
}
