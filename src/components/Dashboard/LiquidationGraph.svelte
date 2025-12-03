<script lang=ts>
    import { type WhaleLiquidationSummaryModel } from "models/dashboard";
    import { formatDollar } from "utils/helpers";

    export let liquidationSummary: Record<string, WhaleLiquidationSummaryModel[]> = {};
    export let handleWhaleSwitch: any;

    const ALLOWED_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'SOLUSDT', 'BNBUSDT', 'DOGEUSDT'];
    let liquidationSummaryData: Array<{ 
        symbol: string; 
        longLiquidation: number;
        shortLiquidation: number; 
        // totalLiquidation: number 
    }> = [];

    const setLiquidationSummary = () => {
        liquidationSummaryData = ALLOWED_SYMBOLS.map(symbol => ({
            symbol,
            longLiquidation: 0,
            shortLiquidation: 0,
        }));

        if (liquidationSummary && Object.keys(liquidationSummary).length > 0) {
            ALLOWED_SYMBOLS.forEach((symbol: string, index: number) => {
                if (liquidationSummary[symbol] && Array.isArray(liquidationSummary[symbol])) {
                    liquidationSummary[symbol].forEach((item: WhaleLiquidationSummaryModel) => {
                        if (liquidationSummaryData[index]) {
                            liquidationSummaryData[index].longLiquidation += item.longLiquidation;
                            liquidationSummaryData[index].shortLiquidation += item.shortLiquidation;
                        }
                    });
                }
            });
        }
    }

    // 각 항목의 총 청산액과 비율 계산
    const getTotalLiquidation = (item: { longLiquidation: number; shortLiquidation: number }) => {
        return item.longLiquidation + item.shortLiquidation;
    }

    const getLongPercentage = (item: { longLiquidation: number; shortLiquidation: number }) => {
        const total = getTotalLiquidation(item);
        if (total === 0) return 0;
        return (item.longLiquidation / total) * 100;
    }

    const getShortPercentage = (item: { longLiquidation: number; shortLiquidation: number }) => {
        const total = getTotalLiquidation(item);
        if (total === 0) return 0;
        return (item.shortLiquidation / total) * 100;
    }

    $: liquidationSummary, setLiquidationSummary();

</script>

<section class="whale-container">
    <div class="whale-container__header">
        <h3>🐋 고래 청산 그래프 24H</h3>
        <button class="whale-container__header__button"  on:click={handleWhaleSwitch}>리스트</button>
    </div>
    <div class="whale-container__list">
        {#if liquidationSummaryData && liquidationSummaryData.length > 0}
            {#each liquidationSummaryData as item, index}
                <div class="bar-chart-item">
                    <div class="symbol-section">
                        <span class="symbol">{item.symbol.replace('USDT', '')}</span>
                        <span class="total-amount">{@html formatDollar(getTotalLiquidation(item))}</span>
                    </div>
                    <div class="bar-chart-container">
                        <div class="bar-chart-wrapper">
                            
                            <!-- 숏 바 -->
                            <div 
                                class="bar-section short-bar-section" 
                                style="width: {getShortPercentage(item)}%"
                            >
                                <div class="bar-fill short-fill"></div>
                                {#if getShortPercentage(item) > 10}
                                    <div class="bar-label short-label">
                                        {@html formatDollar(item.shortLiquidation)}
                                    </div>
                                {/if}
                            </div>

                            <!-- 롱 바 -->
                            <div 
                                class="bar-section long-bar-section" 
                                style="width: {getLongPercentage(item)}%"
                            >
                                <div class="bar-fill long-fill"></div>
                                {#if getLongPercentage(item) > 10}
                                    <div class="bar-label long-label">
                                        {@html formatDollar(item.longLiquidation)}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        {:else}
            <div class="whale-container__empty-state">
                <p>청산 데이터가 없습니다</p>
            </div>
        {/if}
    </div>
</section>

<style lang="scss">
    @use "./whaleContainer.scss";
    @use "./LiquidationGraph.scss";
</style>