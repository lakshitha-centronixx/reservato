import { cleanPhoneNumber, mapCurrentOpenTimes } from "../helpers/functions";
import { GoogleData } from "../models/google";

export class GoogleService {
    private readonly apiKey: string;

    constructor() {
        this.apiKey = process.env.GOOGLE_API_KEY!;
    }

    async getNearbyRestaurants(query: string) {

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

        const fields = ["businessStatus", "id", "displayName", "googleMapsUri", "internationalPhoneNumber",
            "location", "addressComponents", "websiteUri", "priceLevel", "rating", "userRatingCount", "photos",
            "paymentOptions", "parkingOptions", "accessibilityOptions", "takeout", "delivery",
            "dineIn", "curbsidePickup", "reservable", "servesBreakfast", "servesLunch",
            "servesDinner", "servesBeer", "servesWine", "servesBrunch", "servesVegetarianFood",
            "outdoorSeating", "liveMusic", "menuForChildren", "servesCocktails", "servesDessert",
            "servesCoffee", "goodForChildren", "allowsDogs", "restroom", "goodForWatchingSports", "goodForGroups",
            "reviewSummary", "currentOpeningHours"
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

    private async getPlaceDetails(fields: string, placeId: string): Promise<GoogleData | null> {

        const endpoint = `https://places.googleapis.com/v1/places/${placeId}`;

        const url = `${endpoint}?fields=${fields}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-Goog-Api-Key": this.apiKey
            }
        });

        const placeDetails = await response.json();

        if (!response.ok) {
            return null;
        }

        if (placeDetails?.businessStatus === "OPERATIONAL") {
            const reservable = placeDetails?.reservable;
            const rating = placeDetails?.rating;

            if (reservable && rating > 4) {

                const components = placeDetails?.addressComponents ?? [];

                const get = (type: string) =>
                    components.find((c: any) => c.types.includes(type))?.longText ?? '';

                const address = [get("street_number"), get("route")].filter(Boolean).join(" ");

                const coordinates = {
                    latitude: placeDetails.location?.latitude ?? 0,
                    longitude: placeDetails.location?.longitude ?? 0
                };

                const photoUrls: string[] = (placeDetails.photos ?? []).map(
                    (photo: any) => photo.googleMapsUri
                ).filter(Boolean);

                return {
                    id: placeDetails.id,
                    name: placeDetails.displayName?.text,
                    googleMapsUri: placeDetails.googleMapsUri,
                    websiteUri: placeDetails.websiteUri,
                    internationalPhoneNumber: cleanPhoneNumber(placeDetails.internationalPhoneNumber),
                    priceLevel: placeDetails.priceLevel,
                    rating: placeDetails.rating,
                    userRatingCount: placeDetails.userRatingCount,
                    addressComponents: {
                        address,
                        town: get("sublocality_level_1"),
                        city: get("locality"),
                        country: get("country"),
                    },
                    location: coordinates,
                    currentOpeningHours: mapCurrentOpenTimes(placeDetails.currentOpeningHours?.weekdayDescriptions),
                    reviewSummary: placeDetails.reviewSummary?.text?.text,

                    photos: photoUrls,

                    paymentOptions: {
                        acceptsCreditCards: placeDetails.paymentOptions?.acceptsCreditCards,
                        acceptsDebitCards: placeDetails.paymentOptions?.acceptsDebitCards,
                        acceptsCashOnly: placeDetails.paymentOptions?.acceptsCashOnly,
                        acceptsNfc: placeDetails.paymentOptions?.acceptsNfc,
                    },

                    parkingOptions: {
                        freeStreetParking: placeDetails.parkingOptions?.freeStreetParking,
                        paidStreetParking: placeDetails.parkingOptions?.paidStreetParking,
                        paidParkingLot: placeDetails.parkingOptions?.paidParkingLot,
                        paidGarageParking: placeDetails.parkingOptions?.paidGarageParking,
                        freeGarageParking: placeDetails.parkingOptions?.freeGarageParking,
                        freeParkingLot: placeDetails.parkingOptions?.freeParkingLot,
                        valetParking: placeDetails.parkingOptions?.valetParking,
                    },

                    accessibilityOptions: {
                        wheelchairAccessibleParking: placeDetails.accessibilityOptions?.wheelchairAccessibleParking,
                        wheelchairAccessibleEntrance: placeDetails.accessibilityOptions?.wheelchairAccessibleEntrance,
                        wheelchairAccessibleRestroom: placeDetails.accessibilityOptions?.wheelchairAccessibleRestroom,
                        wheelchairAccessibleSeating: placeDetails.accessibilityOptions?.wheelchairAccessibleSeating,
                    },

                    takeout: placeDetails.takeout,
                    delivery: placeDetails.delivery,
                    dineIn: placeDetails.dineIn,
                    curbsidePickup: placeDetails.curbsidePickup,
                    reservable: placeDetails.reservable,

                    servesBreakfast: placeDetails.servesBreakfast,
                    servesLunch: placeDetails.servesLunch,
                    servesDinner: placeDetails.servesDinner,
                    servesBrunch: placeDetails.servesBrunch,
                    servesVegetarianFood: placeDetails.servesVegetarianFood,
                    servesBeer: placeDetails.servesBeer,
                    servesWine: placeDetails.servesWine,
                    servesCocktails: placeDetails.servesCocktails,
                    servesDessert: placeDetails.servesDessert,
                    servesCoffee: placeDetails.servesCoffee,

                    outdoorSeating: placeDetails.outdoorSeating,
                    liveMusic: placeDetails.liveMusic,
                    menuForChildren: placeDetails.menuForChildren,
                    goodForChildren: placeDetails.goodForChildren,
                    goodForGroups: placeDetails.goodForGroups,
                    goodForWatchingSports: placeDetails.goodForWatchingSports,
                    allowsDogs: placeDetails.allowsDogs,
                    restroom: placeDetails.restroom
                };
            }
        }

        return null;
    }
}
