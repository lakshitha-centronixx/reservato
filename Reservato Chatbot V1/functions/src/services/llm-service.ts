import OpenAI from 'openai';
import { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources.mjs';
import { getNearbyRestaurants } from '../llm/tools/definitions/get-nearby-restaurants';
import { recommendationSchema } from '../llm/schema/recommendation-schema';
import { makeReservation } from '../llm/tools/definitions/make-reservation';
import { getRestaurantDetails } from '../llm/tools/definitions/get-restaurant-details';
import { getRestaurantByName } from '../llm/tools/definitions/get-restaurant-by-name';

export class LlmService {
    private readonly client: OpenAI;

    constructor() {
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    }

    async getResponse(conversationHistory: ChatCompletionMessageParam[], handleChunk: (chunk: string) => void) {

        let tools: ChatCompletionTool[] = [getNearbyRestaurants, makeReservation, getRestaurantDetails, getRestaurantByName];

        const stream = await this.client.chat.completions.create({
            model: "gpt-4.1",
            messages: conversationHistory,
            tools: tools,
            temperature: 0.1,
            response_format: recommendationSchema,
            stream: true,
        });

        let reply: OpenAI.Chat.Completions.ChatCompletionChunk.Choice.Delta = {}

        for await (const event of stream) {

            const delta = event.choices[0].delta;

            const content = delta?.content;
            const toolCalls = delta?.tool_calls;

            if (reply?.role == undefined) {
                reply = delta;
            }

            if (content) {
                reply.content = reply.content + content;
                handleChunk(content);
            }

            if (toolCalls) {
                for (const toolCall of toolCalls) {

                    let currentToolIndex = toolCall.index;

                    let selectedTool = reply.tool_calls?.[currentToolIndex];

                    let args = toolCall.function?.arguments;

                    if (selectedTool?.function) {
                        selectedTool.function.arguments = selectedTool.function?.arguments! + args;
                    } else {
                        reply.tool_calls![toolCall.index] = toolCall
                    }
                }
            }
        }

        return reply
    }
}
