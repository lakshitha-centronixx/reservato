import { IOpenHour } from "./open-hours";

export interface IBusinessHour {
    open?: IOpenHour[];
    is_open_now?: boolean;
}