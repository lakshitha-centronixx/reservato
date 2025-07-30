import { PlacesManager } from '../../db/places-manager';
import { cleanGoogleDataForLlm, cleanObject } from '../../helpers/clean-results';
import { YelpService } from '../../services/yelp-service';
import { GoogleService } from './../../services/google-service';

export async function getNearbyRestaurants(query: string) {

    let googleService = new GoogleService();
    let googleRecommendations = await googleService.getNearbyRestaurants(query);

    let yelpService = new YelpService();

    let nearbyRestaurants = [];

    for (const place of googleRecommendations) {

        let placesManager = new PlacesManager(place.placeId);

        let cleanedGoogleDataForLlm = cleanGoogleDataForLlm(place);
        let cleanedGoogleData = cleanObject(place);

        let location = place?.city;
        let restaurantName = place?.displayName;

        if (location && restaurantName) {
            let yelpResponse = await yelpService.searchForRestaurant(location, restaurantName);

            if (yelpResponse) {
                let cleanedYelpData = cleanObject(yelpResponse);
                placesManager.writeToDB(cleanedGoogleData, cleanedYelpData);
                nearbyRestaurants.push({ "google": cleanedGoogleDataForLlm, "yelp": cleanedYelpData });
            }
        }

        placesManager.writeToDB(cleanedGoogleData, null);
        nearbyRestaurants.push({ "google": cleanedGoogleDataForLlm });
    }

    return nearbyRestaurants;
}