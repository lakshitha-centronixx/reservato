import { YelpData } from "../models/yelp";

export class YelpService {
    private readonly baseUrl: string;
    private readonly apiKey: string;

    constructor() {
        this.baseUrl = "https://api.yelp.com/v3";
        this.apiKey = process.env.YELP_API_KEY!;
    }

    async searchForRestaurant(location: string, restaurantName: string): Promise<YelpData | null> {
        const url = `${this.baseUrl}/businesses/search?location=${encodeURIComponent(location)}&term=${encodeURIComponent(restaurantName)}&sort_by=best_match&limit=1`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "authorization": `Bearer ${this.apiKey}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return null;
        }

        let businessData = data?.businesses[0];

        if (businessData) {
            return {
                id: businessData.id,
                name: businessData.name,
                reviewCount: businessData.review_count,
                categories: businessData.categories?.map((cat: any) => cat.title),
                rating: businessData.rating,
                transactions: businessData.transactions,
                location: {
                    address1: businessData.location?.address1,
                    address2: businessData.location?.address2,
                    address3: businessData.location?.address3,
                    city: businessData.location?.city,
                    zip_code: businessData.location?.zip_code,
                    country: businessData.location?.country,
                    state: businessData.location?.state,
                    display_address: businessData.location?.display_address,
                    cross_streets: businessData.location?.cross_streets,
                },
                phone: businessData.phone,
                display_phone: businessData.display_phone,
                attributes: {
                    businessUrl: businessData.attributes?.business_url,
                    alcohol: businessData.attributes?.alcohol ?? null,
                    ambience: businessData.attributes?.ambience ?? {},
                    bike_parking: businessData.attributes?.bike_parking ?? null,
                    androidPay: businessData.attributes?.business_accepts_android_pay ?? null,
                    applePay: businessData.attributes?.business_accepts_apple_pay ?? null,
                    creditCards: businessData.attributes?.business_accepts_credit_cards ?? null,
                    businessParking: businessData.attributes?.business_parking ?? {},
                    caters: businessData.attributes?.caters ?? null,
                    dogsAllowed: businessData.attributes?.dogs_allowed ?? false,
                    driveThru: businessData.attributes?.drive_thru ?? null,
                    goodForKids: businessData.attributes?.good_for_kids ?? null,
                    goodForMeal: businessData.attributes?.good_for_meal ?? {},
                    happyHour: businessData.attributes?.happy_hour ?? null,
                    hasTv: businessData.attributes?.has_tv ?? null,
                    menuUrl: businessData.attributes?.menu_url ?? '',
                    noiseLevel: businessData.attributes?.noise_level ?? null,
                    open24Hours: businessData.attributes?.open24_hours ?? null,
                    platformDelivery: businessData.attributes?.platform_delivery ?? null,
                    restaurantsAttire: businessData.attributes?.restaurants_attire ?? null,
                    restaurantsDelivery: businessData.attributes?.restaurants_delivery ?? false,
                    restaurantsGoodForGroups: businessData.attributes?.restaurants_good_for_groups ?? null,
                    restaurantsReservations: businessData.attributes?.restaurants_reservations ?? null,
                    restaurantsTableService: businessData.attributes?.restaurants_table_service ?? null,
                    restaurantsTakeOut: businessData.attributes?.restaurants_take_out ?? false,
                    waitlistReservation: businessData.attributes?.waitlist_reservation ?? null,
                    wifi: businessData.attributes?.wi_fi ?? null,
                    likedByVegans: businessData.attributes?.liked_by_vegans ?? null,
                    outdoorSeating: businessData.attributes?.outdoor_seating ?? false,
                    likedByVegetarians: businessData.attributes?.liked_by_vegetarians ?? null,
                }
            };
        }

        return null;
    }
}
