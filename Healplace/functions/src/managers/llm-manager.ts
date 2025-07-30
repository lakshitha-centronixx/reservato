import { recommendationSchema } from '../llm/schema/recommendation-schema';
import { ChatMistralAI } from "@langchain/mistralai";

export class LlmManager {
    private readonly client: ChatMistralAI;

    constructor() {
        this.client = new ChatMistralAI({
            apiKey: process.env.MISTRAL_API_KEY,
            modelName: "mistral-small-2506",
            maxTokens: 128000
        });
    }

    async getRecommendationModel() {
        return this.client.withStructuredOutput(recommendationSchema, { method: "json_mode", includeRaw: true });
    }
}
