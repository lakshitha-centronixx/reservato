import { IGoodForMeal } from "./good-for-meal";

export interface IAttribute {
    business_accepts_android_pay?: boolean;
    business_accepts_apple_pay?: boolean;
    alcohol?: string;
    ambience?: string[];
    best_nights?: string;
    bike_parking?: boolean;
    business_accepts_credit_cards?: boolean;
    business_parking?: string[];
    caters?: boolean;
    dogs_allowed?: boolean;
    drive_thru?: boolean;
    good_for_dancing?: boolean;
    good_for_kids?: boolean;
    good_for_meal?: IGoodForMeal;
    happy_hour?: boolean;
    has_pool_table?: boolean;
    has_tv?: boolean;
    menu_url?: string;
    noise_level?: string;
    open24_hours?: boolean;
    platform_delivery?: string;
    restaurants_attire?: string;
    restaurants_delivery?: boolean;
    restaurants_good_for_groups?: boolean;
    restaurants_reservations?: boolean;
    restaurants_table_service?: boolean;
    restaurants_take_out?: boolean;
    waitlist_reservation?: boolean;
    wi_fi?: string;
    liked_by_vegans?: boolean;
    liked_by_vegetarians?: boolean;
    outdoor_seating?: boolean;
    hot_and_new?: boolean;
}