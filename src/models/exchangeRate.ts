interface MarketItem {
    price: number;
    scp: number;
    scr: string;
}
  
export interface ExchangeRateDataModel {
    USDKRW: MarketItem;
    USDINDEX: MarketItem;
    KOSPI: MarketItem;
    NASDAQ: MarketItem;
    SNP500: MarketItem;
}
