<script lang="ts">
    import { type SymbolInfo, type TickerInfo } from "models/chart";
    import { handleError, moneyFormat, urlParams } from "utils/helpers";

    export let symbolInfo: SymbolInfo;
    export let ticker: TickerInfo;

</script>

<div class="coin-info card">
    {#if ticker}
        <div class="coin-info__header">
            <img 
                class="coin-info__header__icon" 
                src="https://s3-symbol-logo.tradingview.com/crypto/XTVC{symbolInfo.s}--big.svg" 
                alt="{symbolInfo.s} 아이콘"
                on:error={handleError}
            >
            <p class="coin-info__header__name">
                {#if ticker.kr}
                    {ticker.kr}
                {:else}
                    {ticker.s}
                {/if}
                <span class="coin-info__header__name__symbol">{symbolInfo.s}</span>
            </p>
            <div class="coin-info__header__left">
                <div class="coin-info__header__left__price">
                    <p class="coin-info__header__left__price__trade {ticker.tc}">{moneyFormat(ticker.tp)}</p>
                    <p class="coin-info__header__left__price__currency">{symbolInfo.cu}</p>
                </div> 
                <div class="coin-info__header__left__change-price
                    {
                        ticker.scp > 0
                        ? 'up' 
                        : ticker.scp < 0 
                        ? 'down' 
                        : ''
                    }"
                >
                    <p>{ticker.scr ? ticker.scr : 0}%</p>
                    <p>{moneyFormat(ticker.scp)}</p>
                </div>
            </div>
        </div>
        <div class="coin-info__body">
            <div class="coin-info__body__high-low">
                <p>고가 <span class="up">{moneyFormat(ticker.hp)}</span></p>
                <p>저가 <span class="down">{moneyFormat(ticker.lp)}</span></p>
            </div>
            {#if ticker.l52wp}
                <div class="coin-info__body__week-price">
                    <p>저가대비(52주)
                        <span class="up">{((ticker.tp / ticker.l52wp) * 100 - 100).toFixed(2)}%</span>
                    </p>
                    <p>고가대비(52주)
                        <span class="down">{((ticker.tp / ticker.h52wp) * 100 - 100).toFixed(2)}%</span>
                    </p>
                </div>
            {/if}
            <div class="coin-info__body__volume">
                <p>거래량(24H) {moneyFormat(ticker.atv24h)} <span>{ticker.s}</span></p>
                <p>거래대금(24H) <span class="coin-info__body__volume__trade-price">{moneyFormat(ticker.atp24h)}</span> <span>{symbolInfo.cu}</span></p>
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    @use "./CoinInfo.scss";
</style>