import { ChatCompletionMessageParam } from "openai/resources.mjs";

export function removeToolMessages(conversationHistory: ChatCompletionMessageParam[]) {
    return conversationHistory.filter(msg => {
        if (msg.role === 'tool') {
            return false
        };

        if (msg.role === 'assistant' && 'tool_calls' in msg && msg.tool_calls !== null) {
            return false;
        };

        return true;
    });
}