import { ChatCompletionTool } from "openai/resources.mjs";

export const getRestaurantByName: ChatCompletionTool = {
    "type": "function",
    "function": {
        "name": "get_restaurant_by_name",
        "description": "Search for restaurant by name and get relevant details",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "name of the restaurant. e.g. 'Tunnel'"
                },
                "location": {
                    "type": "string",
                    "description": "location of the restaurant. e.g. 'Mount Lavinia'"
                }
            },
            "required": ["name", "location"]
        }
    }
};