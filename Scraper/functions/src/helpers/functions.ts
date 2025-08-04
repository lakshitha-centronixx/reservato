import { IRestaurantPayload } from "./interfaces";
import { ResponseSchemaType } from "./types";

export function cleanPhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
        return phoneNumber.replace(/[\s-]/g, "");
    }

    return "";
}

export function mapCurrentOpenTimes(weekdayDescriptions: Record<string, string>): { date: string; times: string[] }[] {
    const weekdayMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (!weekdayDescriptions || typeof weekdayDescriptions !== 'object') {
        return [];
    }

    return Object.entries(weekdayDescriptions).map(([dayIndex, timeRange]) => {
        const dayName = weekdayMap[parseInt(dayIndex, 10)] || dayIndex;
        const times = timeRange.split(/,|\/| and /).map(s => s.replace(/^\s*([A-Za-z]+):\s*/, '').trim()).filter(Boolean);
        return { date: dayName, times };
    });
}

export function cleanObject(obj: Record<string, any> | null | undefined): Record<string, any> {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
        return {};
    }

    const cleaned: Record<string, any> = {};

    for (const key in obj) {
        const value = obj[key];

        if (value === null || value === undefined) {
            continue;
        } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
                cleaned[key] = value
                    .map(item => (typeof item === 'object' && item !== null ? cleanObject(item) : item))
                    .filter(item => item !== null && item !== undefined);
            } else {
                const cleanedValue = cleanObject(value);
                if (Object.keys(cleanedValue).length > 0) {
                    cleaned[key] = cleanedValue;
                }
            }
        } else {
            cleaned[key] = value;
        }
    }

    return cleaned;
}

export function flattenObject(obj: Record<string, any>, prefix = '', result: Record<string, string | number | boolean> = {}): Record<string, string | number | boolean> {
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}_${key}` : key;

        const isImageField = ['media', 'imageUrl', 'image_url', 'images'].includes(key.toLowerCase());
        if (isImageField) continue;

        if (Array.isArray(value)) {
            if (value.every(v => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')) {
                result[fullKey] = value.join(', ');
            }
        } else if (typeof value === 'object' && value !== null) {
            flattenObject(value, fullKey, result);
        } else if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
        ) {
            result[fullKey] = value;
        }
    }

    return result;
}

export function buildSearchText(data: any): string {
    const lines: string[] = [];

    const addLine = (label: string, value: string | string[] | undefined) => {
        if (!value) return;
        if (Array.isArray(value)) value = value.join(', ');
        if (value) lines.push(`${label}: ${value}`);
    };

    const getTrueFields = (obj: any) => Object.entries(obj ?? {}).filter(([_, val]) => val === true).map(([key]) => key.replace(/([A-Z])/g, ' $1')).join(', ');

    const identification = data.identification ?? {};
    addLine("GoogleId", identification.googlePlaceId);

    const core = data.coreInfo ?? {};
    addLine("Name", core.name);
    addLine("Description", core.description);
    addLine("Categories", core.categories);
    if (core.address) {
        const addr = core.address;
        addLine("Address", [addr.address, addr.town, addr.city, addr.country].filter(Boolean).join(', '));
    }
    addLine("Menu URL", core.menuUrl);
    addLine("Price Level", core.priceLevel);

    addLine("Review Summary", data.summary?.reviewSummary);

    if (data.location) {
        addLine("Latitude", data.location.latitude);
        addLine("Longitude", data.location.longitude);
    }

    if (data.contact) {
        addLine("Phone", data.contact.internationalPhoneNumber);
        addLine("Website", data.contact.websiteUri);
        addLine("Email", data.contact.email);
        addLine("Google Maps", data.contact.googleMapsUri);
    }

    if (data.openHours) {
        const openHours = Object.entries(data.openHours)
            .map(([day, times]) => `${day}: ${(times as string[]).join(', ')}`)
            .join(' | ');
        addLine("Open Hours", openHours);
    }

    addLine("Payment Options", getTrueFields(data.payments));

    addLine("Parking Options", getTrueFields(data.parking));

    addLine("Accessibility", getTrueFields(data.accessibility));

    const services = data.services ?? {};
    const servicesFields = { ...services };
    delete servicesFields.platformDelivery;
    addLine("Service Options", getTrueFields(servicesFields));
    if (services.platformDelivery) addLine("Platform Delivery", services.platformDelivery);

    const food = data.foodDrinkMeals ?? {};
    addLine("Food & Drinks", getTrueFields(food));
    addLine("Good For Meals", food.goodForMeal);

    const ambience = data.ambience ?? {};
    addLine("Ambience", ambience.ambience);
    addLine("Best Nights", ambience.bestNights);
    addLine("Attire", ambience.restaurantsAttire);
    addLine("Noise Level", ambience.noiseLevel);
    addLine("Ambience Extras", getTrueFields({
        happyHour: ambience.happyHour,
        liveMusic: ambience.liveMusic,
        hasTv: ambience.hasTv,
        hasPoolTable: ambience.hasPoolTable
    }));

    addLine("Special Features", getTrueFields(data.specialFeatures));

    addLine("WiFi", data.connectivity?.wiFi);

    return lines.filter(Boolean).join('. ');
}

export function transformResponseToApiBody(response: ResponseSchemaType): IRestaurantPayload {
    const openHours: Record<string, string> = {};
    Object.entries(response.openHours).forEach(([day, times]) => {
        openHours[day] = times.join(", ");
    });

    return {
        google_place_id: response.identification.googlePlaceId,
        yelp_business_id: response.identification.yelpBusinessId,
        name: response.coreInfo.name,
        description: response.coreInfo.description,
        categories: response.coreInfo.categories,
        address: {
            street: response.coreInfo.address.address,
            city: response.coreInfo.address.city,
            state: response.coreInfo.address.town,
            zip: "",
        },
        menu_url: response.coreInfo.menuUrl,
        price_level: response.coreInfo.priceLevel,
        latitude: response.location.latitude,
        longitude: response.location.longitude,
        review_summary: response.summary.reviewSummary,
        international_phone_number: response.contact.internationalPhoneNumber,
        website_uri: response.contact.websiteUri,
        email: response.contact.email,
        google_maps_uri: response.contact.googleMapsUri,
        media: {
            images: response.media
        },
        open_hours: openHours,
        payments: {
            visa: response.payments.acceptsCreditCards || false,
            mastercard: response.payments.acceptsDebitCards || false,
            cash: response.payments.acceptsCashOnly || false
        },
        parking: {
            valet: response.parking.paidParkingLot || false,
            street: response.parking.freeParkingLot || false
        },
        accessibility: {
            wheelchair: response.accessibility.wheelchairAccessibleEntrance || false
        },
        services: {
            delivery: true,
            takeout: true
        },
        food_drink_meals: {
            lunch: response.foodDrinkMeals.servesLunch || false,
            dinner: response.foodDrinkMeals.servesDinner || false
        },
        ambience: {
            romantic: response.ambience.ambience?.includes("romantic") || false,
            family_friendly: response.ambience.ambience?.includes("family_friendly") || false
        },
        special_features: {
            live_music: response.ambience.liveMusic || false
        },
        connectivity: {
            wifi: response.connectivity.wiFi?.toLowerCase() === "free"
        }
    };
}
