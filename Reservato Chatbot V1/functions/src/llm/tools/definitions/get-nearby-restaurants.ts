import { ChatCompletionTool } from "openai/resources.mjs";

export const getNearbyRestaurants: ChatCompletionTool = {
    "type": "function",
    "function": {
        "name": "get_nearby_restaurants",
        "description": "Get nearby restaurants for a given location",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "coffee shop near Seattle"
                }
            },
            "required": ["query"]
        }
    }
};