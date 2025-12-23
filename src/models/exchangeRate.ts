interface MarketItemModel {
    price: number;
    scp: number;
    scr: string;
}

export interface ExchangeRateDataModel {
    USDKRW: MarketItemModel;
    USDINDEX: MarketItemModel;
    KOSPI: MarketItemModel;
    NASDAQ: MarketItemModel;
    SNP500: MarketItemModel;
}
