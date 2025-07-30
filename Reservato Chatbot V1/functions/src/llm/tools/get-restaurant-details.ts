import { PlacesManager } from "../../db/places-manager";
import { cleanObject } from "../../helpers/clean-results";
import { GoogleService } from "../../services/google-service";
import { YelpService } from "../../services/yelp-service";

export async function getRestaurantDetails(placeId: string) {

    let googleService = new GoogleService();
    let yelpService = new YelpService();

    const fields = ["businessStatus", "id", "displayName", "editorialSummary", "googleMapsUri", "internationalPhoneNumber", "location",
        "addressComponents", "websiteUri", "priceLevel", "rating", "userRatingCount", "photos", "paymentOptions", "parkingOptions", "accessibilityOptions",
        "takeout", "delivery", "dineIn", "curbsidePickup", "reservable", "servesBreakfast", "servesLunch", "servesDinner",
        "servesBeer", "servesWine", "servesBrunch", "servesVegetarianFood",
        "outdoorSeating", "liveMusic", "menuForChildren", "servesCocktails", "servesDessert", "servesCoffee", "goodForChildren",
        "allowsDogs", "restroom", "goodForWatchingSports", "goodForGroups"
    ].join(",");

    let googleRecommendation = await googleService.getPlaceDetails(fields, placeId);

    if (googleRecommendation) {

        let placesManager = new PlacesManager(googleRecommendation.placeId);

        let cleanedGoogleData = cleanObject(googleRecommendation);

        let location = cleanedGoogleData?.city;
        let restaurantName = cleanedGoogleData?.displayName;

        if (location && restaurantName) {
            let yelpResponse = await yelpService.searchForRestaurant(location, restaurantName);

            if (yelpResponse) {
                let cleanedYelpData = cleanObject(yelpResponse);
                placesManager.writeToDB(cleanedGoogleData, cleanedYelpData);
                return ({ "google": cleanedGoogleData, "yelp": cleanedYelpData });
            }
        }

        placesManager.writeToDB(cleanedGoogleData, null);
        return ({ "google": cleanedGoogleData });
    }

    return "failed";
}