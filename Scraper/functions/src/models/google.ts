export interface GoogleData {
    id: string;
    name: string;
    googleMapsUri: string;
    internationalPhoneNumber: string;

    location: {
        latitude: number;
        longitude: number;
    };

    addressComponents: {
        address: string;
        town: string;
        city: string;
        country: string;
    };

    websiteUri: string;
    priceLevel: string;
    rating: number;
    userRatingCount: number;
    photos: string[];

    paymentOptions: {};
    parkingOptions: {};
    accessibilityOptions: {};

    takeout: boolean;
    delivery: boolean;
    dineIn: boolean;
    curbsidePickup: boolean;

    reservable: boolean;
    servesBreakfast: boolean;
    servesLunch: boolean;
    servesDinner: boolean;
    servesBeer: boolean;
    servesWine: boolean;
    servesBrunch: boolean;
    servesVegetarianFood: boolean;
    servesCocktails: boolean;
    servesDessert: boolean;
    servesCoffee: boolean;

    goodForChildren: boolean;
    goodForGroups: boolean;
    goodForWatchingSports: boolean;
    allowsDogs: boolean;
    menuForChildren: boolean;
    liveMusic: boolean;
    outdoorSeating: boolean;
    restroom: boolean;

    reviewSummary: string;

    currentOpeningHours: { date: string; times: string[] }[];
}
