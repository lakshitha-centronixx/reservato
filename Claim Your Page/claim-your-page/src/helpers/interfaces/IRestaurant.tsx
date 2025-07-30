export interface IRestaurantData {
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
    openHours: {
        monday: string[];
        tuesday: string[];
        wednesday: string[];
        thursday: string[];
        friday: string[];
        saturday: string[];
        sunday: string[];
    };
    payments: {
        acceptsCreditCards: boolean;
        acceptsDebitCards: boolean;
        acceptsCashOnly: boolean;
        acceptsNfc: boolean;
        businessAcceptsApplePay: boolean;
        businessAcceptsAndroidPay: boolean;
    };
    parking: {
        freeParkingLot: boolean;
        paidParkingLot: boolean;
        bikeParking: boolean;
    };
    accessibility: {
        wheelchairAccessibleEntrance: boolean;
        wheelchairAccessibleRestroom: boolean;
    };
    services: {
        takeout: boolean;
        delivery: boolean;
        curbsidePickup: boolean;
        dineIn: boolean;
        platformDelivery: string;
        reservable: boolean;
        restaurantsReservations: boolean;
        restaurantsTableService: boolean;
        waitlistReservation: boolean;
    };
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
    specialFeatures: {
        outdoorSeating: boolean;
        goodForChildren: boolean;
        allowsDogs: boolean;
        caters: boolean;
        dogsAllowed: boolean;
        goodForDancing: boolean;
        goodForGroups: boolean;
        hotAndNew: boolean;
        open24Hours: boolean;
        restroom: boolean;
        goodForWatchingSports: boolean;
        likedByVegans: boolean;
        likedByVegetarians: boolean;
    };
    connectivity: {
        wiFi: string;
    };
}