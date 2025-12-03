export interface OceanSignalModel {
    txHash: string;
    amount: number;
    timestamp: string;
}

export interface WhaleLiquidationModel {
    symbol: string;
    side: string;
    price: string;
    quantity: string;
    amount: number;
    time: string;
}

export interface WhaleLiquidationSummaryModel {
    timestamp: string;
    symbol: string;
    longLiquidation: number;
    shortLiquidation: number;
    totalLiquidation: number;
    longCount: number;
    shortCount: number;
    totalCount: number;
}
