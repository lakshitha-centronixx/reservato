import { ChatCompletionTool } from "openai/resources.mjs";

export const getRestaurantDetails: ChatCompletionTool = {
    "type": "function",
    "function": {
        "name": "get_restaurant_details",
        "description": "Get any detail about the restaurant",
        "parameters": {
            "type": "object",
            "properties": {
                "placeId": {
                    "type": "string",
                    "description": "placeId of the restaurant"
                }
            },
            "required": ["placeId"]
        }
    }
};