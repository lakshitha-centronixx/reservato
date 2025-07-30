import { ResponseFormatJSONSchema } from "openai/resources.mjs";

export const recommendationSchema: ResponseFormatJSONSchema = {
    "type": "json_schema",
    "json_schema": {
        "name": "recommendation_schema",
        "strict": true,
        "schema": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string"
                },
                "recommendations": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "placeId": {
                                "type": "string"
                            },
                            "businessId": {
                                "type": "string"
                            },
                            "restaurantName": {
                                "type": "string"
                            }
                        },
                        "additionalProperties": false,
                        "required": [
                            "placeId",
                            "businessId",
                            "restaurantName"
                        ]
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "text",
                "recommendations"
            ]
        }
    }
}
