import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

export function serializeBaseMessage(message: BaseMessage): any {
    return {
        type: message.getType(),
        content: message.content,
    };
}

export function deserializeBaseMessage(obj: any): BaseMessage {
    switch (obj.type) {
        case "human":
            return new HumanMessage(obj.content);
        case "ai":
            return new AIMessage(obj.content);
        case "system":
            return new SystemMessage(obj.content);
        default:
            return new HumanMessage(obj.content);
    }
}
