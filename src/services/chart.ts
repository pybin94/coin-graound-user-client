import { TickerAskBid, type TickerInfo } from "models/chart";
import { sortObjectData } from "utils/helpers";
import { chartSort, chartSortOrder, chartSortTarget, nightMode } from "stores/store";
import { get } from "svelte/store";

interface WebSocketOptions {
    marketUrl?: string;
    tickerCodes?: string[];
    tickers: Record<string, TickerInfo>;
    setAskBidBlink?: (ticker: any) => void;
    hasAllKeysAddedD?: (value: any) => boolean;
    updateTickers: (tickers: Record<string, TickerInfo>) => void;
    updateNeedSorting?: (val: boolean) => void;
}

export const setupWebSocket = ({
    marketUrl,
    tickerCodes,
    tickers,
    setAskBidBlink = () => { },
    hasAllKeysAddedD,
    updateTickers,
    updateNeedSorting = () => { },
}: WebSocketOptions): { ws: WebSocket; unsubscribe: () => void } => {
    const ws = new WebSocket(marketUrl);
    let needSorting = false
    let newtickers = tickers;

    const unsubscribe = chartSort.subscribe((val) => {
        if (!val) return;

        const sorted = sortObjectData({
            data: newtickers,
            order: get(chartSortOrder),
            target: get(chartSortTarget),
        });
        newtickers = sorted;
        updateTickers(newtickers);
        chartSort.set(false)
    })

    ws.onopen = () => {
        const request = [
            { ticket: String(new Date().getTime()) },
            { type: "ticker", codes: tickerCodes },
            { format: "SIMPLE" },
        ];
        ws.send(JSON.stringify(request));
    };

    ws.onmessage = async (event: MessageEvent) => {
        const data = await event.data.text();
        const parsedData = JSON.parse(data);
        const parseSymbol = parsedData.cd.replace("KRW-", "");

        const updatedTicker = {
            cd: parsedData.cd,
            hp: parsedData.hp,
            lp: parsedData.lp,
            tp: parsedData.tp,
            scp: parsedData.scp,
            scr: (parsedData.scr * 100).toFixed(2),
            atv24h: parsedData.atv24h,
            atp24h: parsedData.atp24h,
            h52wp: parsedData.h52wp,
            l52wp: parsedData.l52wp,
            ab: parsedData.ab,
            mw: parsedData.mw,
            id: newtickers[parseSymbol]?.id,
            kr: newtickers[parseSymbol]?.kr,
            en: newtickers[parseSymbol]?.en,
            s: parseSymbol,
            ef: newtickers[parseSymbol]?.ef,
        } as TickerInfo;

        if (newtickers[parseSymbol]) {
            newtickers[parseSymbol] = updatedTicker;
            updateTickers(newtickers);
            setAskBidBlink(updatedTicker);
        }

        if (!needSorting && hasAllKeysAddedD(newtickers)) {
            const sorted = sortObjectData({
                data: newtickers,
                order: get(chartSortOrder),
                target: get(chartSortTarget),
            });
            needSorting = true;
            updateNeedSorting(true);
            newtickers = sorted;
            updateTickers(newtickers);
        }
    };

    ws.onerror = (error) => {
        console.error("웹소켓 오류 발생:", error);
    };

    return { ws, unsubscribe };
}

export const setupWebSocketBinance = ({
    marketUrl,
    tickers,
    setAskBidBlink = () => { },
    updateTickers,
}: WebSocketOptions): { ws: WebSocket; unsubscribe: () => void } => {
    const ws = new WebSocket(marketUrl);
    let newtickers = tickers;

    const unsubscribe = chartSort.subscribe((val) => {
        if (!val) return;

        const sorted = sortObjectData({
            data: newtickers,
            order: get(chartSortOrder),
            target: get(chartSortTarget),
        });
        newtickers = sorted;
        updateTickers(newtickers);
        chartSort.set(false)
    })

    ws.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        const usdtTickers = data.filter((ticker) => ticker.s.endsWith("USDT"));

        usdtTickers.forEach((parsedData) => {
            const parseSymbol = parsedData.s.replace("USDT", "");
            const tickerAskBid: TickerAskBid = parsedData.c == parsedData.a ? TickerAskBid.ASK : TickerAskBid.BID
            const updatedTicker = {
                hp: parseFloat(parsedData.h),
                lp: parseFloat(parsedData.l),
                tp: parseFloat(parsedData.c),
                scp: parseFloat(parsedData.c) - parseFloat(parsedData.o),
                scr: Number(parsedData.P).toFixed(2),
                atv24h: parseFloat(parsedData.v),
                atp24h: parseFloat(parsedData.q),
                h52wp: parsedData.h52wp,
                l52wp: parsedData.l52wp,
                ab: tickerAskBid,
                mw: parsedData.mw,
                id: newtickers[parseSymbol]?.id,
                kr: newtickers[parseSymbol]?.kr,
                en: newtickers[parseSymbol]?.en,
                s: parseSymbol,
                ef: newtickers[parseSymbol]?.ef,
            } as TickerInfo;

            if (newtickers?.[parseSymbol]) {
                newtickers[parseSymbol] = updatedTicker;
                updateTickers(newtickers);
                setAskBidBlink(updatedTicker);
            }
        });
    };

    return { ws, unsubscribe };
}

export const fetchBinanceTicker = async ({
    marketUrl,
    tickers,
    updateTickers,
    updateNeedSorting
}: WebSocketOptions) => {
    const response = await fetch(marketUrl);
    const res = await response.json();
    const usdtTickers = res.filter((ticker: any) => ticker.symbol.endsWith("USDT"));

    usdtTickers.forEach((parsedData: any) => {
        const parseSymbol = parsedData.symbol.replace("USDT", "");

        const updatedTicker = {
            hp: parseFloat(parsedData.highPrice),
            lp: parseFloat(parsedData.lowPrice),
            tp: parseFloat(parsedData.lastPrice),
            scp: parseFloat(parsedData.lastPrice) - parseFloat(parsedData.openPrice),
            scr: Number(parsedData.priceChangePercent).toFixed(2),
            atv24h: parseFloat(parsedData.volume),
            atp24h: parseFloat(parsedData.quoteVolume),
            h52wp: undefined,
            l52wp: undefined,
            ab: undefined,
            mw: undefined,
            id: tickers[parseSymbol]?.id,
            kr: tickers[parseSymbol]?.kr,
            en: tickers[parseSymbol]?.en,
            s: parseSymbol,
            ef: tickers[parseSymbol]?.ef,
        } as TickerInfo;

        if (tickers[parseSymbol]) {
            tickers[parseSymbol] = updatedTicker;
            updateNeedSorting(true);
        }
    });

    const sorted = sortObjectData({
        data: tickers,
        order: get(chartSortOrder),
        target: get(chartSortTarget),
    });
    updateTickers(sorted);
}
