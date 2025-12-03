<script lang="ts">
    import { Exchange, type SymbolInfo, TickerMarketWarning, type TickerInfo } from "models/chart";
    import { formatDollar, moneyFormat, setParams, urlParams } from "utils/helpers";

    export let getSymbolInfo: Function;
    export let tickers: Record<string, TickerInfo> = {};
    export let getExchanges: any;
    export let needSorting: boolean;
    export let sortTickers: Function;
    export let resetOrderButton: any;
    export let symbolInfo: SymbolInfo;
    export let handleCoinListVisible: Function;
    export let isCoinListVisible: boolean;

    const exchanges = [
        {name: "업비트", icon: "upbit", id: Exchange.UPBIT, status: "SPOT"},
        {name: "빗썸", icon: "bithumb", id: Exchange.BITHUMB, status: "SPOT"},
        {name: "바이낸스", icon: "binance", id: Exchange.BINANCE, status: "SPOT"},
        {name: "바이낸스 선물", icon: "binance", id: Exchange.BINANCEF, status: "FUTURE"},
        {name: "바이비트", icon: "bybit", id: Exchange.BYBIT, status: "FUTURE"},
        {name: "OKX", icon: "okx", id: Exchange.OKX, status: "FUTURE"},
        {name: "비트겟", icon: "bitget", id: Exchange.BITGET, status: "FUTURE"},
    ]
    
    let exchangeId = urlParams("exchange");

    let searchTerm: string = ""; 
    $: filteredTickers = Object.values(tickers).filter(ticker => 
        ticker.kr?.includes(searchTerm) ||  
        ticker.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||  
        ticker.s?.toUpperCase().includes(searchTerm.toUpperCase())
    );

    const changeExchange = (e: any, exchange: Exchange) =>{
        exchangeId = exchange

        resetOrderButton(true);
        setParams('exchange', exchange)
        setParams('symbol', "BTC")
        getSymbolInfo({s: "BTC"})
    }

</script>

<section class="coin card" class:visible={isCoinListVisible}>
    <div class="coin__search">
        <div class="coin__search__wrap">
            <i class="fa-solid fa-magnifying-glass coin__search__wrap__icon"></i>
            <input 
                type="text" 
                class="coin__search__wrap__input" 
                bind:value={searchTerm} 
                placeholder="코인 검색 (비트코인, bitcoin, BTC)" 
            />
            {#if searchTerm.length > 0}
                <button class="unset coin__search__wrap__reset" on:click={()=>{searchTerm = ""}}>
                    <i class="fa-solid fa-xmark"></i>
                </button>
            {/if}
        </div>
    </div>
    <div class="coin__exchange">
        {#each exchanges as item}
            <button 
                type="button" 
                class="coin__exchange__list unset {item.status}" 
                class:active={exchangeId == item.id} 
                on:click={(e)=>{
                    if(exchangeId != item.id) {
                        changeExchange(e, item.id);
                        getExchanges();
                    }
            }}><img class="coin__exchange__list__icon" src="/src/assets/icon/exchange/{item.icon}.webp" alt=""></button>
        {/each}
    </div>
    <div class="coin__list-header">
        <div class="coin__list-header__name">
            이름
        </div>
        <div class="coin__list-header__price">
            현재가
        </div>
        <button type="button" class="coin__list-header__rate order-button unset" on:click={(e)=>{sortTickers(e, "scr")}}>
            전일대비
            <div class="order-button__icon">
                <i class="fa-solid fa-caret-up"></i>
                <i class="fa-solid fa-caret-down"></i>
            </div>
        </button>
        <button type="button" class="coin__list-header__volume order-button unset" on:click={(e)=>{sortTickers(e, "atp24h")}}>
            <p>거래대금</p>
            <div class="order-button__icon">
                <i class="fa-solid fa-caret-up"></i>
                <i class="fa-solid fa-caret-down down order-default"></i>
            </div>
        </button>
    </div>
    <ul class="coin__list-wrap">
        {#each Object.entries(filteredTickers) as [market, price]}
            <li 
                class="coin__list {price.tc}"
                class:active={urlParams("symbol") == price.s}
                on:click={()=>{getSymbolInfo({
                    id: price.id,
                    kr: price.kr,
                    en: price.en,
                    s: price.s,
                })
                handleCoinListVisible(true)
                }}>
                <div class="coin__list__coin">
                    <p class="coin__list__coin__name">
                        {#if price.kr}
                            {price.kr}
                        {:else}
                            {price.s}
                        {/if}
                        {#if price.mw == TickerMarketWarning.CAUTION}
                            <div class="coin__list__coin__name__warning">
                                <span>유</span>
                            </div>
                        {/if}
                    </p>
                    <p class="coin__list__coin__symbol">{price.s}/{symbolInfo.cu}</p>
                </div>
                {#if needSorting && price?.tp}
                    <div class="coin__list__price
                        {
                            price.scp > 0
                            ? 'up' 
                            : price.scp < 0 
                            ? 'down' 
                            : ''
                        }
                    ">
                        {moneyFormat(price.tp)}
                    </div>
                    <div class="coin__list__rate
                        {
                            price.scp > 0
                            ? 'up' 
                            : price.scp < 0 
                            ? 'down' 
                            : ''
                        }
                    ">
                        <p>{price.scr}%</p>
                        <p>{price.scp.toLocaleString()}</p>
                    </div>
                    <div class="coin__list__volume">
                        {#if exchangeId == "1" || exchangeId == "2"}
                            {moneyFormat((price.atp24h / 1000000).toFixed())}<span class="coin__list__volume__unit">백만</span>
                        {:else}
                            {@html formatDollar(price.atp24h)}
                        {/if}
                    </div>
                {:else}
                    <div class="coin__list__price"></div>
                    <div class="coin__list__rate"></div>
                    <div class="coin__list__volume"></div>
                {/if}
            </li>
        {/each}
    </ul>
</section>


<style lang="scss">
    @use "./CoinList.scss";
</style>
