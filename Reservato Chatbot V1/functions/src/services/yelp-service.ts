import { IBusinessHour } from "../models/yelp/business-hours";
import { IOpenHour } from "../models/yelp/open-hours";
import { IYelpDetails } from "../models/yelp/yelp-details";

export class YelpService {
    private readonly baseUrl: string;
    private readonly apiKey: string;

    constructor() {
        this.baseUrl = "https://api.yelp.com/v3";
        this.apiKey = process.env.YELP_API_KEY!;
    }

    async searchForRestaurant(location: string, restaurantName: string): Promise<IYelpDetails | null> {
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
                businessId: businessData?.id,
                name: businessData?.name,
                categories: businessData?.categories?.map((cat: any) => cat.title),
                rating: businessData?.rating,
                reviewCount: businessData?.review_count,
                business_hours: businessData?.business_hours?.map((bh: any): IBusinessHour => ({
                    open: bh.open?.map((oh: any): IOpenHour => ({
                        is_overnight: oh.is_overnight,
                        start: oh.start,
                        end: oh.end,
                        day: oh.day,
                    })),
                    is_open_now: bh.is_open_now,
                })),
                attributes: {
                    business_accepts_android_pay: businessData?.attributes?.business_accepts_android_pay,
                    business_accepts_apple_pay: businessData?.attributes?.business_accepts_apple_pay,
                    alcohol: businessData?.attributes?.alcohol,
                    ambience: businessData?.attributes?.ambience,
                    best_nights: businessData?.attributes?.best_nights,
                    bike_parking: businessData?.attributes?.bike_parking,
                    business_accepts_credit_cards: businessData?.attributes?.business_accepts_credit_cards,
                    business_parking: businessData?.attributes?.business_parking,
                    caters: businessData?.attributes?.caters,
                    dogs_allowed: businessData?.attributes?.dogs_allowed,
                    drive_thru: businessData?.attributes?.drive_thru,
                    good_for_dancing: businessData?.attributes?.good_for_dancing,
                    good_for_kids: businessData?.attributes?.good_for_kids,
                    good_for_meal: businessData?.attributes?.good_for_meal,
                    happy_hour: businessData?.attributes?.happy_hour,
                    has_pool_table: businessData?.attributes?.has_pool_table,
                    has_tv: businessData?.attributes?.has_tv,
                    menu_url: businessData?.attributes?.menu_url,
                    noise_level: businessData?.attributes?.noise_level,
                    open24_hours: businessData?.attributes?.open24_hours,
                    platform_delivery: businessData?.attributes?.platform_delivery,
                    restaurants_attire: businessData?.attributes?.restaurants_attire,
                    restaurants_delivery: businessData?.attributes?.restaurants_delivery,
                    restaurants_good_for_groups: businessData?.attributes?.restaurants_good_for_groups,
                    restaurants_reservations: businessData?.attributes?.restaurants_reservations,
                    restaurants_table_service: businessData?.attributes?.restaurants_table_service,
                    restaurants_take_out: businessData?.attributes?.restaurants_take_out,
                    waitlist_reservation: businessData?.attributes?.waitlist_reservation,
                    wi_fi: businessData?.attributes?.wi_fi,
                    liked_by_vegans: businessData?.attributes?.liked_by_vegans,
                    liked_by_vegetarians: businessData?.attributes?.liked_by_vegetarians,
                    outdoor_seating: businessData?.attributes?.outdoor_seating,
                    hot_and_new: businessData?.attributes?.hot_and_new,
                }
            };
        }

        return null;
    }
}
