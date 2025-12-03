export interface SortObjectData {
    data: object;
    target: string;
    order?: OrderType;
} 

export enum OrderType {
    DESC = "desc",
    ASC = "asc",
}

export interface GotParams {
    urlParams: string;
    method?: string;
    setParams?: object;
    EXTRA_URL?: boolean;
}