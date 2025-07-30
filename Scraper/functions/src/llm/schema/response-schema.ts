import { ResponseFormatJSONSchema } from "openai/resources.mjs";

export const responseSchema: ResponseFormatJSONSchema = {
    "type": "json_schema",
    "json_schema": {
        "name": "restaurant_response_schema",
        "strict": true,
        "schema": {
            "type": "object",
            "properties": {
                "identification": {
                    "type": "object",
                    "properties": {
                        "googlePlaceId": { "type": "string" },
                        "yelpBusinessId": { "type": "string" }
                    },
                    "required": ["googlePlaceId", "yelpBusinessId"],
                    "additionalProperties": false
                },
                "summary": {
                    "type": "object",
                    "properties": {
                        "reviewSummary": { "type": "string" }
                    },
                    "required": ["reviewSummary"],
                    "additionalProperties": false
                },
                "coreInfo": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string" },
                        "description": { "type": "string" },
                        "categories": {
                            "type": "array",
                            "items": { "type": "string" }
                        },
                        "address": {
                            "type": "object",
                            "properties": {
                                "address": { "type": "string" },
                                "town": { "type": "string" },
                                "city": { "type": "string" },
                                "country": { "type": "string" }
                            },
                            "required": ["address", "town", "city", "country"],
                            "additionalProperties": false
                        },
                        "menuUrl": { "type": "string" },
                        "priceLevel": { "type": "string" }
                    },
                    "required": [
                        "name",
                        "description",
                        "categories",
                        "address",
                        "menuUrl",
                        "priceLevel"
                    ],
                    "additionalProperties": false
                },
                "location": {
                    "type": "object",
                    "properties": {
                        "latitude": { "type": "string" },
                        "longitude": { "type": "string" }
                    },
                    "required": ["latitude", "longitude"],
                    "additionalProperties": false
                },
                "contact": {
                    "type": "object",
                    "properties": {
                        "internationalPhoneNumber": { "type": "string" },
                        "websiteUri": { "type": "string" },
                        "email": { "type": "string" },
                        "googleMapsUri": { "type": "string" }
                    },
                    "required": [
                        "internationalPhoneNumber",
                        "websiteUri",
                        "email",
                        "googleMapsUri"
                    ],
                    "additionalProperties": false
                },
                "media": {
                    "type": "array",
                    "items": { "type": "string" }
                },
                "openHours": {
                    "type": "object",
                    "properties": {
                        "monday": { "type": "array", "items": { "type": "string" } },
                        "tuesday": { "type": "array", "items": { "type": "string" } },
                        "wednesday": { "type": "array", "items": { "type": "string" } },
                        "thursday": { "type": "array", "items": { "type": "string" } },
                        "friday": { "type": "array", "items": { "type": "string" } },
                        "saturday": { "type": "array", "items": { "type": "string" } },
                        "sunday": { "type": "array", "items": { "type": "string" } }
                    },
                    "required": [
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday"
                    ],
                    "additionalProperties": false
                },
                "payments": {
                    "type": "object",
                    "properties": {
                        "acceptsCreditCards": { "type": "boolean" },
                        "acceptsDebitCards": { "type": "boolean" },
                        "acceptsCashOnly": { "type": "boolean" },
                        "acceptsNfc": { "type": "boolean" },
                        "businessAcceptsApplePay": { "type": "boolean" },
                        "businessAcceptsAndroidPay": { "type": "boolean" }
                    },
                    "required": [
                        "acceptsCreditCards",
                        "acceptsDebitCards",
                        "acceptsCashOnly",
                        "acceptsNfc",
                        "businessAcceptsApplePay",
                        "businessAcceptsAndroidPay"
                    ],
                    "additionalProperties": false
                },
                "parking": {
                    "type": "object",
                    "properties": {
                        "freeParkingLot": { "type": "boolean" },
                        "paidParkingLot": { "type": "boolean" },
                        "bikeParking": { "type": "boolean" }
                    },
                    "required": [
                        "freeParkingLot",
                        "paidParkingLot",
                        "bikeParking"
                    ],
                    "additionalProperties": false
                },
                "accessibility": {
                    "type": "object",
                    "properties": {
                        "wheelchairAccessibleEntrance": { "type": "boolean" },
                        "wheelchairAccessibleRestroom": { "type": "boolean" }
                    },
                    "required": [
                        "wheelchairAccessibleEntrance",
                        "wheelchairAccessibleRestroom"
                    ],
                    "additionalProperties": false
                },
                "services": {
                    "type": "object",
                    "properties": {
                        "takeout": { "type": "boolean" },
                        "delivery": { "type": "boolean" },
                        "curbsidePickup": { "type": "boolean" },
                        "dineIn": { "type": "boolean" },
                        "platformDelivery": { "type": "string" },
                        "reservable": { "type": "boolean" },
                        "restaurantsReservations": { "type": "boolean" },
                        "restaurantsTableService": { "type": "boolean" },
                        "waitlistReservation": { "type": "boolean" }
                    },
                    "required": [
                        "takeout",
                        "delivery",
                        "curbsidePickup",
                        "dineIn",
                        "platformDelivery",
                        "reservable",
                        "restaurantsReservations",
                        "restaurantsTableService",
                        "waitlistReservation"
                    ],
                    "additionalProperties": false
                },
                "foodDrinkMeals": {
                    "type": "object",
                    "properties": {
                        "servesBreakfast": { "type": "boolean" },
                        "servesLunch": { "type": "boolean" },
                        "servesDinner": { "type": "boolean" },
                        "servesBeer": { "type": "boolean" },
                        "servesWine": { "type": "boolean" },
                        "servesBrunch": { "type": "boolean" },
                        "servesVegetarianFood": { "type": "boolean" },
                        "servesCocktails": { "type": "boolean" },
                        "servesDessert": { "type": "boolean" },
                        "servesCoffee": { "type": "boolean" },
                        "menuForChildren": { "type": "boolean" },
                        "goodForMeal": {
                            "type": "array",
                            "items": { "type": "string" }
                        }
                    },
                    "required": [
                        "servesBreakfast",
                        "servesLunch",
                        "servesDinner",
                        "servesBeer",
                        "servesWine",
                        "servesBrunch",
                        "servesVegetarianFood",
                        "servesCocktails",
                        "servesDessert",
                        "servesCoffee",
                        "menuForChildren",
                        "goodForMeal"
                    ],
                    "additionalProperties": false
                },
                "ambience": {
                    "type": "object",
                    "properties": {
                        "ambience": { "type": "array", "items": { "type": "string" } },
                        "bestNights": { "type": "array", "items": { "type": "string" } },
                        "restaurantsAttire": { "type": "array", "items": { "type": "string" } },
                        "noiseLevel": { "type": "string" },
                        "happyHour": { "type": "boolean" },
                        "liveMusic": { "type": "boolean" },
                        "hasTv": { "type": "boolean" },
                        "hasPoolTable": { "type": "boolean" }
                    },
                    "required": [
                        "ambience",
                        "bestNights",
                        "restaurantsAttire",
                        "noiseLevel",
                        "happyHour",
                        "liveMusic",
                        "hasTv",
                        "hasPoolTable"
                    ],
                    "additionalProperties": false
                },
                "specialFeatures": {
                    "type": "object",
                    "properties": {
                        "outdoorSeating": { "type": "boolean" },
                        "goodForChildren": { "type": "boolean" },
                        "allowsDogs": { "type": "boolean" },
                        "caters": { "type": "boolean" },
                        "dogsAllowed": { "type": "boolean" },
                        "goodForDancing": { "type": "boolean" },
                        "goodForGroups": { "type": "boolean" },
                        "hotAndNew": { "type": "boolean" },
                        "open24Hours": { "type": "boolean" },
                        "restroom": { "type": "boolean" },
                        "goodForWatchingSports": { "type": "boolean" },
                        "likedByVegans": { "type": "boolean" },
                        "likedByVegetarians": { "type": "boolean" }
                    },
                    "required": [
                        "outdoorSeating",
                        "goodForChildren",
                        "allowsDogs",
                        "caters",
                        "dogsAllowed",
                        "goodForDancing",
                        "goodForGroups",
                        "hotAndNew",
                        "open24Hours",
                        "restroom",
                        "goodForWatchingSports",
                        "likedByVegans",
                        "likedByVegetarians"
                    ],
                    "additionalProperties": false
                },
                "connectivity": {
                    "type": "object",
                    "properties": {
                        "wiFi": { "type": "string" }
                    },
                    "required": ["wiFi"],
                    "additionalProperties": false
                }
            },
            "required": [
                "identification",
                "summary",
                "coreInfo",
                "location",
                "contact",
                "media",
                "openHours",
                "payments",
                "parking",
                "accessibility",
                "services",
                "foodDrinkMeals",
                "ambience",
                "specialFeatures",
                "connectivity"
            ],
            "additionalProperties": false
        }
    }
};
