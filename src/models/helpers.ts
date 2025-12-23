export interface SortObjectDataModel {
    data: object;
    target: string;
    order?: OrderTypeModel;
}

export enum OrderTypeModel {
    DESC = "desc",
    ASC = "asc",
}

export interface GotParamsModel {
    urlParams: string;
    method?: string;
    setParams?: object;
    EXTRA_URL?: boolean;
}