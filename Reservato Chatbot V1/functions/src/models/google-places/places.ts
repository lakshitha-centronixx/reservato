import { IParkingOption } from './parking-options';
import { IAccessibilityOption } from "./accessibility-options";
import { IPaymentOption } from "./payment-options";
import { ICoordinate } from './coordinates';

export interface IPlace {
    placeId: string;
    displayName?: string;
    editorialSummary?: string;
    googleMapsUri?: string;
    internationalPhoneNumber?: string,
    coordinates?: ICoordinate,
    city?: string,
    websiteUri?: string;
    priceLevel?: string;
    rating?: string;
    userRatingCount?: string;
    photos?: string[];
    paymentOptions?: IPaymentOption;
    parkingOptions?: IParkingOption;
    accessibilityOptions?: IAccessibilityOption;
    takeout?: boolean
    delivery?: boolean
    dineIn?: boolean
    curbsidePickup?: boolean
    reservable?: boolean
    servesBreakfast?: boolean
    servesLunch?: boolean
    servesDinner?: boolean
    servesBeer?: boolean
    servesWine?: boolean
    servesBrunch?: boolean
    servesVegetarianFood?: boolean
    outdoorSeating?: boolean
    liveMusic?: boolean
    menuForChildren?: boolean
    servesCocktails?: boolean
    servesDessert?: boolean
    servesCoffee?: boolean
    goodForChildren?: boolean
    allowsDogs?: boolean
    restroom?: boolean
    goodForWatchingSports?: boolean
    goodForGroups?: boolean
}