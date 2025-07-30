import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources.mjs';
import { responseSchema } from '../llm/schema/response-schema';
import { logger } from 'firebase-functions';

export class LlmService {
    private readonly client: OpenAI;

    constructor() {
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async getResponse(conversationHistory: ChatCompletionMessageParam[]) {

        const completion = await this.client.chat.completions.create({
            model: "gpt-4.1",
            messages: conversationHistory,
            temperature: 0.1,
            response_format: responseSchema
        });

        if (completion.choices[0].message.refusal) {
            logger.error(`LLM Refused - ${completion.choices[0].message.refusal}`)
        }

        return completion.choices[0].message.content;
    }
}
