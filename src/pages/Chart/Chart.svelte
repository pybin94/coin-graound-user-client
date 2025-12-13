<script lang="ts">
    import TradingView from "components/Chart/TradingView.svelte";
    import CoinList from "components/Chart/CoinList.svelte";
    import CoinInfo from "components/Chart/CoinInfo.svelte";
    import Feed from "components/Chart/Feed.svelte";
    import { getLs, got, setLs, setParams, urlParams } from "utils/helpers";
    import { type TickerInfo, type SymbolInfo, Exchange } from "models/chart";
    import { OrderType } from "models/helpers";
    import { fetchBinanceTicker, setupWebSocket, setupWebSocketBinance } from "services/chart";
    import { onDestroy } from "svelte";
    import { chartSort, chartSortOrder, chartSortTarget } from "stores/store";
    import { get } from "svelte/store";
    import Modal from "utils/Modal.svelte";

    let symbolInfo: SymbolInfo = {id: 1, kr: "비트코인", en: "Bitcoin", s: "BTC", cu: null, ef: null, p: null};
    let ws: WebSocket;
    let tickers: Record<string, TickerInfo> = {};
    let urlQuery: string;
    let tickerCodes: Array<string> = [];
    let marketUrl: string;
    let previousUrl: string;
    let needSorting = false;
    let wsUnsubscribe: (() => void) | null = null;
    let isCoinListVisible = false;

    const init = async () => {
        await getExchanges();
    }

    const getExchanges = async () => {
        urlQuery = window.location.search || "?exchange=1";

        if(!urlParams("exchange")) {
            setParams('exchange', "1")
            setParams('symbol', "BTC");
        };

                        
        if(urlParams("symbol") !== "BTC") {
            symbolInfo.s = urlParams("symbol")
        }

        if (urlQuery !== previousUrl) {
            if (ws) ws.close();

            const exchangeData = getLs(`exchange${urlParams("exchange")}`)
            let response: any;
            previousUrl = urlQuery;

            if(!exchangeData) {
                response = await got({
                    urlParams: `/coin/coin-exchange${urlQuery}`,
                });
                setLs(`exchange${urlParams("exchange")}`, JSON.stringify(response.data), 3600)
            }

            if (exchangeData || response.statusCode === 1) {
                const data = exchangeData ? JSON.parse(exchangeData) : response.data;
                tickerCodes = [];
                marketUrl = data.exchange.url;
                data.coinExchange.forEach((item) => {
                    tickerCodes.push(item["ticker"]);
                });

                symbolInfo.p = data.exchange.prefix;
                symbolInfo.cu = data.exchange.currency;
                symbolInfo.ef = data.exchange.extraField;

                tickers = data.coinExchange.reduce((acc, item) => {
                    acc[item.coin.symbol] = {
                        id: item.coin.id,
                        kr: item.coin.koreanName,
                        en: item.coin.englishName,
                        s: item.coin.symbol,
                        cu: item.coin.currency,
                        ef: item.coin.extraField,
                    };
                    return acc;
                }, {});

                needSorting = false;
                chartSortTarget.set("atp24h");
                chartSortOrder.set(OrderType.DESC);

                switch (String(data.exchange.id)) {
                    case Exchange.UPBIT:
                    case Exchange.BITHUMB:
                        const wsResult = setupWebSocket({
                            marketUrl,
                            tickerCodes,
                            tickers,
                            setAskBidBlink,
                            hasAllKeysAddedD,
                            updateTickers: (newTickers) => tickers = newTickers,
                            updateNeedSorting: (val: boolean) => needSorting = val,
                        });
                        ws = wsResult.ws;
                        wsUnsubscribe = wsResult.unsubscribe;
                        break;
                    case Exchange.BINANCE:
                    case Exchange.BINANCEF:
                        let binanceUrl = "https://api3.binance.com/api/v3/ticker/24hr";
                        if (String(data.exchange.id) == Exchange.BINANCEF)
                            binanceUrl = "https://fapi.binance.com/fapi/v1/ticker/24hr";

                        await fetchBinanceTicker({
                            marketUrl: binanceUrl,
                            tickers,
                            updateTickers: (newTickers) => tickers = newTickers,
                            updateNeedSorting: (val: boolean) => needSorting = val,
                        });
                        const binanceResult = setupWebSocketBinance({
                            marketUrl,
                            tickers,
                            setAskBidBlink,
                            updateTickers: (newTickers) => tickers = newTickers,
                        });
                        ws = binanceResult.ws;
                        wsUnsubscribe = binanceResult.unsubscribe;
                        break;
                }
            }
        }
    };

    const hasAllKeysAddedD = (value) => {
        return Object.values(value).every((set) => set && typeof set === "object" && "tp" in set);
    };

    const tickerBlinkTimers = new WeakMap();

    const setAskBidBlink = (
        // ticker: TickerInfo
    ) => {
        // const newTicker = ticker.ab;
        // const color = newTicker === TickerAskBid.ASK ? "up" : "down";
        // const parseSymbol = ticker.s ? ticker.s : ticker.cd.replace("KRW-", "");
        
        // if (tickers[parseSymbol]) {
        //     tickers[parseSymbol].tc = color;

        //     // 기존 타이머가 있으면 정리
        //     if (tickerBlinkTimers.has(ticker)) {
        //         clearTimeout(tickerBlinkTimers.get(ticker));
        //     }

        //     // 새 타이머 설정
        //     const timer = setTimeout(() => {
        //         if (tickers[parseSymbol]) {
        //             tickers[parseSymbol].tc = undefined;
        //         }
        //         tickerBlinkTimers.delete(ticker);
        //     }, 200);

        //     tickerBlinkTimers.set(ticker, timer);
        // }
    };

    const getSymbolInfo = (info: SymbolInfo) => {
        setParams("symbol", info.s)
        for (const [key, value] of Object.entries(info)) {
            if (value !== undefined) {
                symbolInfo[key] = value;
            }
        }
    }

    const sortTickers = (e: any, target: string) => {
        let sortTarget: string = get(chartSortTarget);
        let sortOrder: OrderType = get(chartSortOrder);

        if (sortTarget == target) {
            sortOrder = sortOrder == OrderType.ASC ? OrderType.DESC : OrderType.ASC;
        } else {
            sortOrder = OrderType.DESC;
        }

        sortTarget = target

        chartSortTarget.set(sortTarget)
        chartSortOrder.set(sortOrder)
        chartSort.set(true)

        resetOrderButton();

        const button = e.target.closest("button");
        const upIcon = button.querySelector(".fa-caret-up");
        const downIcon = button.querySelector(".fa-caret-down");

        if (sortOrder == OrderType.ASC) {
            upIcon.classList.add("up")
        } else if (sortOrder == OrderType.DESC) {
            downIcon.classList.add("down")
        }
    }

    const resetOrderButton = (reset = false) => {
        document.querySelectorAll(".order-button__icon i").forEach((item)=>{
            item.classList.remove("up")
            item.classList.remove("down")
        })

        if (reset == true || get(chartSortOrder) == OrderType.DESC && get(chartSortTarget) == "atp24h"){
            document.querySelector(".order-default").classList.add("down")
        }
    }

    const handleCoinListVisible = (isfalse: boolean = false) => {
        if (isfalse) {
            isCoinListVisible = false
        } else {
            isCoinListVisible = !isCoinListVisible
        }
    }

    onDestroy(() => {
        if (ws) ws.close();
        if (wsUnsubscribe) wsUnsubscribe();
        
        // localStorage 정리
        for (let i = 1; i <= 5; i++) {
            localStorage.removeItem(`exchange${i}`);
        }
    });

    init()
    $: filteredTickers = Object.values(tickers).filter(ticker => 
        ticker.s?.toUpperCase() === symbolInfo.s.toUpperCase()
    );

    $: ticker = filteredTickers[0]
</script>

<section class="chart content">
    <div class="chart__info">
        <CoinInfo {symbolInfo} {ticker}/>
        <TradingView {symbolInfo}/>
        <Feed {symbolInfo} {ticker} />
    </div>
    <CoinList 
        {getSymbolInfo} 
        {getExchanges} 
        {needSorting} 
        {tickers} 
        {sortTickers} 
        {resetOrderButton} 
        {symbolInfo} 
        {handleCoinListVisible}
        {isCoinListVisible}
    />
    <button 
        class="chart__list-btn unset"
        on:click={()=>{handleCoinListVisible()}}
    >
        <i class="fa-solid fa-bars"></i>
    </button>
</section>

<style lang="scss">
    @use "./Chart.scss";
</style>
