export type MailTypes = "ADMIN" | "RESTAURANT";

export type ResponseSchemaType = {
    identification: {
        googlePlaceId: string;
        yelpBusinessId: string;
    };
    summary: {
        reviewSummary: string;
    };
    coreInfo: {
        name: string;
        description: string;
        categories: string[];
        address: {
            address: string;
            town: string;
            city: string;
            country: string;
        };
        menuUrl: string;
        priceLevel: string;
    };
    location: {
        latitude: string;
        longitude: string;
    };
    contact: {
        internationalPhoneNumber: string;
        websiteUri: string;
        email: string;
        googleMapsUri: string;
    };
    media: string[];
    openHours: Record<string, string[]>;
    payments: Record<string, boolean>;
    parking: Record<string, boolean>;
    accessibility: Record<string, boolean>;
    services: Record<string, boolean | string>;
    foodDrinkMeals: {
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
        menuForChildren: boolean;
        goodForMeal: string[];
    };
    ambience: {
        ambience: string[];
        bestNights: string[];
        restaurantsAttire: string[];
        noiseLevel: string;
        happyHour: boolean;
        liveMusic: boolean;
        hasTv: boolean;
        hasPoolTable: boolean;
    };
    specialFeatures: Record<string, boolean>;
    connectivity: {
        wiFi: string;
    };
};