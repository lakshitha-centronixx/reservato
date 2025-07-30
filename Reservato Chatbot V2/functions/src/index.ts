import { getRecommendations } from "./functions/getRecommendations";
import { getRestaurantDetails } from "./functions/getRestaurantDetails";
import "dotenv/config";

export const getLlmRecommendationsV2 = getRecommendations;
export const getDetailsV2 = getRestaurantDetails;
