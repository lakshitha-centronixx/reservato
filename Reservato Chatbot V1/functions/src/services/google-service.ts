import { cleanPhoneNumber } from "../helpers/clean-results";
import { ICoordinate } from "../models/google-places/coordinates";
import { IPlace } from "../models/google-places/places";

export class GoogleService {
    private readonly apiKey: string;

    constructor() {
        this.apiKey = process.env.GOOGLE_API_KEY!;
    }

    async getNearbyRestaurants(query: string): Promise<IPlace[]> {

        const endpoint = `https://places.googleapis.com/v1/places:searchText`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": this.apiKey,
                "X-Goog-FieldMask": "places.id"
            },
            body: JSON.stringify({
                textQuery: query
            })
        });

        let data = await response.json();

        let places = [];

        const fields = ["businessStatus", "id", "displayName", "editorialSummary", "googleMapsUri", "internationalPhoneNumber",
            "location", "addressComponents", "websiteUri", "priceLevel", "rating", "userRatingCount", "photos",
            "paymentOptions", "parkingOptions", "accessibilityOptions", "takeout", "delivery",
            "dineIn", "curbsidePickup", "reservable", "servesBreakfast", "servesLunch",
            "servesDinner", "servesBeer", "servesWine", "servesBrunch", "servesVegetarianFood",
            "outdoorSeating", "liveMusic", "menuForChildren", "servesCocktails", "servesDessert",
            "servesCoffee", "goodForChildren", "allowsDogs", "restroom", "goodForWatchingSports", "goodForGroups"
        ].join(",");

        for (const place of data?.places ?? []) {
            const id = place?.id;
            const placeDetails = await this.getPlaceDetails(fields, id);

            if (placeDetails) {
                places.push(placeDetails);
            }
        }

        return places;
    }

    async getPlaceDetails(fields: string, placeId: string) {

        const endpoint = `https://places.googleapis.com/v1/places/${placeId}`;

        const url = `${endpoint}?fields=${fields}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-Goog-Api-Key": this.apiKey
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return null;
        }

        if (data?.businessStatus === "OPERATIONAL") {

            let photos: string[] = [];

            if (data?.photos) {
                photos = data.photos.slice(0, 5).map((photo: any) => {
                    return `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=800&key=${this.apiKey}`;
                });
            }

            let coordinates: ICoordinate = { latitude: data?.location?.latitude, longitude: data?.location?.longitude };
            let locality = data?.addressComponents.find((component: any) => component.types.includes("locality"));

            return {
                placeId: data?.id,
                displayName: data?.displayName?.text,
                editorialSummary: data?.editorialSummary?.text,
                googleMapsUri: data?.googleMapsUri,
                internationalPhoneNumber: cleanPhoneNumber(data?.internationalPhoneNumber),
                coordinates: coordinates,
                city: locality?.longText,
                websiteUri: data?.websiteUri,
                priceLevel: data?.priceLevel,
                rating: data?.rating,
                userRatingCount: data?.userRatingCount,
                photos: photos,

                paymentOptions: {
                    acceptsCreditCards: data?.paymentOptions?.acceptsCreditCards,
                    acceptsDebitCards: data?.paymentOptions?.acceptsDebitCards,
                    acceptsCashOnly: data?.paymentOptions?.acceptsCashOnly,
                    acceptsNfc: data?.paymentOptions?.acceptsNfc,
                },

                parkingOptions: {
                    freeParkingLot: data?.parkingOptions?.freeParkingLot,
                    paidParkingLot: data?.parkingOptions?.paidParkingLot,
                    freeStreetParking: data?.parkingOptions?.freeStreetParking,
                    paidStreetParking: data?.parkingOptions?.paidStreetParking,
                    valetParking: data?.parkingOptions?.valetParking,
                    freeGarageParking: data?.parkingOptions?.freeGarageParking,
                    paidGarageParking: data?.parkingOptions?.paidGarageParking,
                },

                accessibilityOptions: {
                    wheelchairAccessibleParking: data?.accessibilityOptions?.wheelchairAccessibleParking,
                    wheelchairAccessibleEntrance: data?.accessibilityOptions?.wheelchairAccessibleEntrance,
                    wheelchairAccessibleRestroom: data?.accessibilityOptions?.wheelchairAccessibleRestroom,
                    wheelchairAccessibleSeating: data?.accessibilityOptions?.wheelchairAccessibleSeating,
                },

                takeout: data?.takeout,
                delivery: data?.delivery,
                dineIn: data?.dineIn,
                curbsidePickup: data?.curbsidePickup,
                reservable: data?.reservable,

                servesBreakfast: data?.servesBreakfast,
                servesLunch: data?.servesLunch,
                servesDinner: data?.servesDinner,
                servesBrunch: data?.servesBrunch,
                servesVegetarianFood: data?.servesVegetarianFood,
                servesBeer: data?.servesBeer,
                servesWine: data?.servesWine,
                servesCocktails: data?.servesCocktails,
                servesDessert: data?.servesDessert,
                servesCoffee: data?.servesCoffee,

                outdoorSeating: data?.outdoorSeating,
                liveMusic: data?.liveMusic,
                menuForChildren: data?.menuForChildren,
                goodForChildren: data?.goodForChildren,
                goodForGroups: data?.goodForGroups,
                goodForWatchingSports: data?.goodForWatchingSports,
                allowsDogs: data?.allowsDogs,
                restroom: data?.restroom
            };
        }

        return null;
    }
}
