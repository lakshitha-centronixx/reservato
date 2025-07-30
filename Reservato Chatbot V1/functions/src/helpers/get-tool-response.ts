import { getRestaurantDetails } from "../llm/tools/get-restaurant-details";
import { getNearbyRestaurants } from "../llm/tools/get-nearby-restaurants";
import { makeReservation } from "../llm/tools/make-reservation";

export async function getToolResponse(toolName: string, args: string) {
    let jsonArgs = JSON.parse(args);

    if (toolName === "get_nearby_restaurants") {
        return await getNearbyRestaurants(jsonArgs?.query);
    } else if (toolName === "make_reservation") {
        return makeReservation(jsonArgs?.restaurant, jsonArgs?.datetime, jsonArgs?.adults, jsonArgs?.children);
    } else if (toolName === "get_restaurant_details") {
        return await getRestaurantDetails(jsonArgs?.placeId);
    } else if (toolName === "get_restaurant_by_name") {
        const query = `What can you tell me about ${jsonArgs?.name} in ${jsonArgs?.location}`
        return await getNearbyRestaurants(query);
    }

    return "failed";
}