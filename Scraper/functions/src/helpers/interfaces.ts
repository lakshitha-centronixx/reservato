export interface IRestaurantPayload {
    google_place_id: string;
    yelp_business_id: string;
    name: string;
    description: string;
    categories: string[];
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    menu_url: string;
    price_level: string;
    latitude: string;
    longitude: string;
    review_summary: string;
    international_phone_number: string;
    website_uri: string;
    email: string;
    google_maps_uri: string;
    media: {
        images: string[];
    };
    open_hours: Record<string, string>;
    payments: {
        visa: boolean;
        mastercard: boolean;
        cash: boolean;
    };
    parking: {
        valet: boolean;
        street: boolean;
    };
    accessibility: {
        wheelchair: boolean;
    };
    services: {
        delivery: boolean;
        takeout: boolean;
    };
    food_drink_meals: {
        lunch: boolean;
        dinner: boolean;
    };
    ambience: {
        romantic: boolean;
        family_friendly: boolean;
    };
    special_features: {
        live_music: boolean;
    };
    connectivity: {
        wifi: boolean;
    };
}

