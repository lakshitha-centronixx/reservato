import { IPlace } from "../models/google-places/places";

export function cleanPhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
        return phoneNumber.replace(/[\s-]/g, "");
    }

    return undefined;
}

export function cleanGoogleDataForLlm(placeDetails: IPlace) {

    const keysToRemove = [
        "businessStatus",
        "googleMapsUri",
        "internationalPhoneNumber",
        "websiteUri",
        "userRatingCount",
        "photos"
    ];

    const cleaned: Partial<IPlace> = { ...placeDetails };

    keysToRemove.forEach((key) => {
        delete cleaned[key as keyof IPlace];
    });

    return cleanObject(cleaned);
}

export function cleanObject(obj: Record<string, any>): Record<string, any> {
    const cleaned: Record<string, any> = {};

    for (const key in obj) {
        const value = obj[key];

        if (value === null || value === undefined) {
            continue;
        } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
                cleaned[key] = value.map(item =>
                    typeof item === 'object' && item !== null
                        ? cleanObject(item)
                        : item
                );
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