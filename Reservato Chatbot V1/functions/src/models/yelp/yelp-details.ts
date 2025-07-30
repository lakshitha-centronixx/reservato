import { IAttribute } from "./attributes";
import { IBusinessHour } from "./business-hours";

export interface IYelpDetails {
    businessId: string;
    name?: string;
    rating?: string;
    reviewCount?: string;
    categories?: string[];
    business_hours?: IBusinessHour[];
    attributes?: IAttribute;
}
