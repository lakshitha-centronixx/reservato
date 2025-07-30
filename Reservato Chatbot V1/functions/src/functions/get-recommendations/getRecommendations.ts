import { onRequest } from "firebase-functions/v2/https";
import { ConversationManager } from "../../db/conversation-manager";
import { LlmService } from "../../services/llm-service";
import * as logger from "firebase-functions/logger";
import { getToolResponse } from "../../helpers/get-tool-response";
import { removeToolMessages } from "../../helpers/format-history";
import { ChatCompletionMessageParam } from "openai/resources.mjs";

export const getRecommendations = onRequest(async (req, res) => {

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const { sessionId, prompt, location } = req.body;

    if (!sessionId || !prompt || !location) {
        res.status(400).json({ error: 'Missing sessionId, prompt, or location' });
        return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
        let conversationManager = new ConversationManager(sessionId);
        let llmService = new LlmService();

        let conversations = await conversationManager.getConversation(location);
        conversations.push({ role: "user", content: prompt });

        let filteredConversations = removeToolMessages(conversations);

        let llmResponse = await llmService.getResponse(filteredConversations,
            (chunk) => {
                res.write(chunk);
            }
        );

        conversations.push(llmResponse as ChatCompletionMessageParam);
        filteredConversations.push(llmResponse as ChatCompletionMessageParam);

        while (llmResponse.tool_calls && llmResponse.tool_calls.length > 0) {
            for (const tool of llmResponse.tool_calls) {

                let functionName = tool.function?.name;
                let functionArguments = tool.function?.arguments;

                if (functionName && functionArguments) {
                    let response = await getToolResponse(functionName, functionArguments);

                    conversations.push({ "role": "tool", "tool_call_id": tool.id!, "content": JSON.stringify(response) });
                    filteredConversations.push({ "role": "tool", "tool_call_id": tool.id!, "content": JSON.stringify(response) });
                }
            }

            llmResponse = await llmService.getResponse(filteredConversations,
                (chunk) => {
                    res.write(chunk);
                }
            );

            conversations.push(llmResponse as ChatCompletionMessageParam);
            filteredConversations.push(llmResponse as ChatCompletionMessageParam);
        }

        await conversationManager.updateConversations(conversations);
        
        res.end();
    } catch (error) {
        logger.error("error", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
