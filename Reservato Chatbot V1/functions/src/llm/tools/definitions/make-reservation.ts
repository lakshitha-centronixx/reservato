import { ChatCompletionTool } from "openai/resources.mjs";

export const makeReservation: ChatCompletionTool = {
    "type": "function",
    "function": {
        "name": "make_reservation",
        "description": "Book a reservation at a restaurant for a specific date, time, and party size",
        "parameters": {
            "type": "object",
            "properties": {
                "restaurant": {
                    "type": "string",
                    "description": "The name of the restaurant to book, e.g., 'The French Laundry'"
                },
                "datetime": {
                    "type": "string",
                    "format": "date-time",
                    "description": "The date and time for the reservation in ISO 8601 format, e.g., '2025-04-10T19:00:00'"
                },
                "adults": {
                    "type": "integer",
                    "description": "Number of adults for the reservation",
                    "minimum": 1
                },
                "children": {
                    "type": "integer",
                    "description": "Number of children for the reservation",
                    "minimum": 0
                }
            },
            "required": ["restaurant", "datetime", "adults", "children"]
        }
    }
};
