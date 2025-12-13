<script lang="ts">
    import { got, moneyFormat } from "utils/helpers";
    import type { Post } from "constants/board";
    import { setupWebSocket, setupWebSocketBinance } from "services/chart";
    import type { TickerInfo } from "models/chart";
    import { onDestroy } from "svelte";
    import { usDollerPrice } from "stores/store";
    
    let wsUpbit: WebSocket;
    let wsBinance: WebSocket;
    let upbitTickers: Record<string, TickerInfo> = {};
    let binanceTickers: Record<string, TickerInfo> = {};
    let wsUpbitUnsubscribe: (() => void) | null = null;
    let wsBinanceUnsubscribe: (() => void) | null = null;

    let upbitBtcPrice: number = 0;
    let upbitBtcScp: number = 0;
    let upbitBtcScr: string = "0";
    let upbitUsdtPrice: number = 0;
    let upbitUsdtScp: number = 0;
    let upbitUsdtScr: string = "0";
    let binanceBtcPrice: number = 0;
    let binanceBtcKRWPrice: number = 0;
    let binanceBtcScp: number = 0;
    let binanceBtcScr: string = "0";
    let BTCPremium: number = 0;
    let USDTPremium: number = 0;
    let marketIndicator: any = {};
    let mvrvz24H: number = 0;
    let reconnectDelay = 5000; // 5초 후 재연결

    // 공포탐욕지수 파싱 및 상태 계산
    const getFearAndGreedData = (indexStr: string) => {
        if (!indexStr) return { score: 0, label: 'N/A', color: '#999', level: 'neutral' };
        
        // "33/100" 형식에서 점수 추출
        const score = parseInt(indexStr.split('/')[0]) || parseInt(indexStr) || 0;
        
        let label = '';
        let color = '';
        let level = '';
        
        if (score >= 0 && score <= 24) {
            label = '극단적 공포';
            color = '#f44336';
            level = 'extreme-fear';
        } else if (score >= 25 && score <= 44) {
            label = '공포';
            color = '#ff9800';
            level = 'fear';
        } else if (score >= 45 && score <= 55) {
            label = '중립';
            color = '#ffeb3b';
            level = 'neutral';
        } else if (score >= 56 && score <= 74) {
            label = '탐욕';
            color = '#4caf50';
            level = 'greed';
        } else if (score >= 75 && score <= 100) {
            label = '극단적 탐욕';
            color = '#8bc34a';
            level = 'extreme-greed';
        } else {
            label = 'N/A';
            color = '#999';
            level = 'neutral';
        }
        
        return { score, label, color, level };
    };

    $: fearAndGreedData = getFearAndGreedData(marketIndicator.FearAndGreedIndex || '0');

    // 도미넌스 데이터 파싱 및 비율 계산
    const parseDominance = (value: string | number): number => {
        if (typeof value === 'string') {
            return parseFloat(value.replace('%', '')) || 0;
        }
        return value || 0;
    }

    $: {
        const btcDominance = parseDominance(marketIndicator.BTCDominance || '0');
        const ethDominance = parseDominance(marketIndicator.ETHDominance || '0');
        const altcoinDominance = parseDominance(marketIndicator.AltcoinDominance || '0');
        
        dominanceData = {
            btc: btcDominance,
            eth: ethDominance,
            altcoin: altcoinDominance,
            total: btcDominance + ethDominance + altcoinDominance
        };
    }

    let dominanceData = { btc: 0, eth: 0, altcoin: 0, total: 100 };

    const init = () => {
        connectUpbit();
        connectBinance();
        getMarketIndicator();
    }

    const reconnectUpbit = () => {
        if (wsUpbit) {
            wsUpbit.close();
            wsUpbit = null;
        }
        if (wsUpbitUnsubscribe) {
            wsUpbitUnsubscribe();
            wsUpbitUnsubscribe = null;
        }
        setTimeout(() => {
            connectUpbit();
        }, reconnectDelay);
    }

    const reconnectBinance = () => {
        if (wsBinance) {
            wsBinance.close();
            wsBinance = null;
        }
        if (wsBinanceUnsubscribe) {
            wsBinanceUnsubscribe();
            wsBinanceUnsubscribe = null;
        }
        setTimeout(() => {
            connectBinance();
        }, reconnectDelay);
    }

    const connectUpbit = () => {
        // 업비트 초기 티커 데이터 설정
        upbitTickers = {
            BTC: {
                id: 1,
                kr: "비트코인",
                en: "Bitcoin",
                s: "BTC",
                cu: "KRW",
                ef: null,
            } as any,
            USDT: {
                id: 2,
                kr: "테더",
                en: "Tether",
                s: "USDT",
                cu: "KRW",
                ef: null,
            } as any
        };

        const wsResult = setupWebSocket({
            marketUrl: "wss://api.upbit.com/websocket/v1",
            tickerCodes: ["KRW-BTC", "KRW-USDT"],
            hasAllKeysAddedD: (tickers: Record<string, TickerInfo>) => {
                return Object.keys(tickers).length > 0;
            },
            tickers: upbitTickers,
            updateTickers: (newTickers) => {
                upbitTickers = newTickers;
            },
        });

        wsUpbit = wsResult.ws;
        wsUpbitUnsubscribe = wsResult.unsubscribe;

        wsUpbit.onclose = reconnectUpbit;
        wsUpbit.onerror = reconnectUpbit;
    }

    const connectBinance = () => {
        // 바이낸스 초기 티커 데이터 설정
        binanceTickers = {
            BTC: {
                id: 3,
                kr: "비트코인",
                en: "Bitcoin",
                s: "BTC",
                cu: "USDT",
                ef: null,
            } as any,
        };

        const wsBinanceResult = setupWebSocketBinance({
            marketUrl: "wss://stream.binance.com:9443/ws/!ticker@arr",
            tickers: binanceTickers,
            updateTickers: (newTickers) => {
                binanceTickers = newTickers;
            },
        });

        wsBinance = wsBinanceResult.ws;
        wsBinanceUnsubscribe = wsBinanceResult.unsubscribe;

        wsBinance.onclose = reconnectBinance;
        wsBinance.onerror = reconnectBinance;
    }

    onDestroy(() => {
        if (wsUpbit) {
            wsUpbit.close();
        }
        if (wsBinance) {
            wsBinance.close();
        }
        if (wsUpbitUnsubscribe) {
            wsUpbitUnsubscribe();
        }
        if (wsBinanceUnsubscribe) {
            wsBinanceUnsubscribe();
        }
    });

    $: {
        if (upbitTickers.BTC?.tp) {
            upbitBtcPrice = upbitTickers.BTC.tp;
            upbitBtcScp = upbitTickers.BTC.scp;
            upbitBtcScr = upbitTickers.BTC.scr;
        }
        if (upbitTickers.USDT?.tp) {
            upbitUsdtPrice = upbitTickers.USDT.tp;
            upbitUsdtScp = upbitTickers.USDT.scp;
            upbitUsdtScr = upbitTickers.USDT.scr;
        };
    }
    
    $: {
        if (binanceTickers.BTC?.tp) {
            binanceBtcPrice = binanceTickers.BTC.tp;
            binanceBtcScp = binanceTickers.BTC.scp;
            binanceBtcScr = binanceTickers.BTC.scr;
        };
        if (upbitUsdtPrice > 0 && binanceBtcPrice > 0) {
            binanceBtcKRWPrice = Number((binanceBtcPrice *$usDollerPrice).toFixed(0));
        }

        BTCPremium = binanceBtcKRWPrice > 0
            ? parseFloat((((upbitBtcPrice - binanceBtcKRWPrice) / binanceBtcKRWPrice) * 100).toFixed(2))
            : 0;
        USDTPremium = $usDollerPrice > 0
            ? parseFloat((((upbitUsdtPrice - $usDollerPrice) / $usDollerPrice) * 100).toFixed(2))
            : 0;
    }

    const getMarketIndicator = async () => {
        const response = await got({
            urlParams: `/crowler/market-indicator`,
            EXTRA_URL: true
        });
        if(response.statusCode == 1) {
            marketIndicator = response.data;
            mvrvz24H = parseFloat(marketIndicator.MVRVZ24H.replace(/%/g, ''));
        }
    }

    init();
</script>

<section class="premium-container">
    <div class="header">
        <h3>💰 프리미엄</h3>
    </div>
    
    <div class="premium-content">
        <!-- 업비트 -->
        <div class="exchange-item">
            <div class="exchange-label">업비트</div>
            <div class="price-info">
                <div class="price-row">
                    <span class="coin">BTC</span>
                    <span class="price">{moneyFormat(upbitBtcPrice)} 원</span>
                    <span class="change" class:positive={parseFloat(upbitBtcScr) > 0} class:negative={parseFloat(upbitBtcScr) < 0}>
                        {upbitBtcScr}%
                    </span>
                </div>
                <div class="price-row">
                    <span class="coin">BTC (김프)</span>
                    <span class="price">
                        {binanceBtcKRWPrice > 0 ? moneyFormat(upbitBtcPrice - binanceBtcKRWPrice) : 0} 원
                    </span>
                    <span class="change" class:positive={BTCPremium < 0} class:negative={BTCPremium > 0}>
                        {BTCPremium}%
                    </span>
                </div>
            </div>
        </div>

        <!-- 바이낸스 -->
        <div class="exchange-item">
            <div class="exchange-label">바이낸스 BTC</div>
            <div class="price-info">
                <div class="price-row">
                    <span class="coin">KRW</span>
                    <span class="price">{moneyFormat(binanceBtcKRWPrice)} 원</span>
                    <span class="change" class:positive={parseFloat(binanceBtcScr) > 0} class:negative={parseFloat(binanceBtcScr) < 0}>
                        {binanceBtcScr}%
                    </span>
                </div>
                <div class="price-row">
                    <span class="coin">USD</span>
                    <span class="price">${moneyFormat(binanceBtcPrice)}</span>
                    <span class="change" class:positive={parseFloat(binanceBtcScr) > 0} class:negative={parseFloat(binanceBtcScr) < 0}>
                        {binanceBtcScr}%
                    </span>
                </div>
            </div>
        </div>

        <div class="exchange-item">
            <div class="exchange-label">USDT / USD</div>
            <div class="price-info">
                <div class="price-row">
                    <span class="coin">USDT</span>
                    <span class="price">{moneyFormat(upbitUsdtPrice)} 원</span>
                    <span class="change" class:positive={parseFloat(upbitUsdtScr) > 0} class:negative={parseFloat(upbitUsdtScr) < 0}>
                        {upbitUsdtScr}%
                    </span>
                </div>
                <div class="price-row">
                    <span class="coin">USD (김프)</span>
                    <span class="price">{moneyFormat($usDollerPrice)} 원</span>
                    <span class="change" class:positive={USDTPremium < 0} class:negative={USDTPremium > 0}>
                        {$usDollerPrice > 0 ? (((upbitUsdtPrice - $usDollerPrice) / $usDollerPrice) * 100).toFixed(2) : 0}%
                    </span>
                </div>
            </div>
        </div>
        <div class="exchange-item">
            <div class="exchange-label">
                코인 지표
                <span class="info-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7" cy="7" r="6.5" stroke="currentColor" stroke-width="1"/>
                        <path d="M7 10V7M7 4H7.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <span class="tooltip-text">MVRV-Z SCORE는 시장 가치 대비 실현 가치 비율을 나타내는 지표입니다. 7 이상은 과매수(고평가) 0 이하는 과매도(저평가)를 의미합니다.</span>
                </span>
            </div>
            <div class="price-info">
                <div class="price-row">
                    <span class="coin">MVRV-Z</span>
                    <span class="price">
                        {marketIndicator.MVRVZScore ? marketIndicator.MVRVZScore : 0}
                    </span>
                    <span class="change" class:positive={mvrvz24H > 0} class:negative={mvrvz24H < 0}>
                        {mvrvz24H}%
                    </span>
                </div>
                <div class="price-row fear-greed-row">
                    <span class="coin">
                        공포 탐욕
                        <!-- <span class="gauge-info"> -->
                            <span class="gauge-label" style="color: {fearAndGreedData.color}">
                                {fearAndGreedData.label}
                            </span>
                            <span class="gauge-score" style="color: {fearAndGreedData.color}">
                                {fearAndGreedData.score}
                            </span>
                        <!-- </span> -->
                    </span>
                    <div class="fear-greed-gauge">
                        <div class="gauge-container">
                            <div class="gauge-bar">
                                <div 
                                    class="gauge-fill" 
                                    class:extreme-fear={fearAndGreedData.level === 'extreme-fear'}
                                    class:fear={fearAndGreedData.level === 'fear'}
                                    class:neutral={fearAndGreedData.level === 'neutral'}
                                    class:greed={fearAndGreedData.level === 'greed'}
                                    class:extreme-greed={fearAndGreedData.level === 'extreme-greed'}
                                    style="width: {fearAndGreedData.score}%"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="exchange-item">
            <div class="exchange-label">도미넌스</div>
            <div class="price-info">
                <div class="dominance-list">
                    <div class="dominance-row">
                        <div class="coin-label">
                            <span class="coin-indicator btc"></span>
                            <span class="coin">BTC</span>
                        </div>

                        <div class="coin-label">
                            <span class="coin-indicator eth"></span>
                            <span class="coin">ETH</span>
                        </div>

                        <div class="coin-label">
                            <span class="coin-indicator altcoin"></span>
                            <span class="coin">기타</span>
                        </div>
                    </div>
                    <div class="dominance-row">
                        <span>{marketIndicator.BTCDominance || '0'}</span>
                        <span>{marketIndicator.ETHDominance || '0'}</span>
                        <span>{marketIndicator.AltcoinDominance || '0'}</span>
                    </div>
                </div>
                <!-- 통합 바 차트 -->
                <div class="dominance-bar-chart">
                    <div 
                        class="bar-section btc-bar" 
                        style="width: {dominanceData.total > 0 ? (dominanceData.btc / dominanceData.total) * 100 : 0}%"
                    >
                        <div class="bar-fill btc-fill"></div>
                    </div>
                    <div 
                        class="bar-section eth-bar" 
                        style="width: {dominanceData.total > 0 ? (dominanceData.eth / dominanceData.total) * 100 : 0}%"
                    >
                        <div class="bar-fill eth-fill"></div>
                    </div>
                    <div 
                        class="bar-section altcoin-bar" 
                        style="width: {dominanceData.total > 0 ? (dominanceData.altcoin / dominanceData.total) * 100 : 0}%"
                    >
                        <div class="bar-fill altcoin-fill"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>


<style lang="scss">
    @use "./Premium.scss";
</style>