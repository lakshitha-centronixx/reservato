import { getRecommendations } from "./functions/get-recommendations/getRecommendations";
import { getRestaurantDetails } from "./functions/get-restaurant-details/getRestaurantDetails";
import { testLangs } from "./functions/test";
import "dotenv/config";

export const getLlmRecommendations = getRecommendations;
export const getDetails = getRestaurantDetails;
export const test = testLangs;