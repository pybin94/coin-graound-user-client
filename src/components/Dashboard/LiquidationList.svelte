<script lang=ts>
    import { type WhaleLiquidationModel } from "models/dashboard";
    import { convertToKSTTimeOnly } from "utils/helpers";

    export let liquidationList: WhaleLiquidationModel[] = [];
    export let handleWhaleSwitch: any;

    const formatAmount = (amount: number) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        }
        return `$${amount.toFixed(0)}`;
    };

    const formatPrice = (price: string) => {
        const num = parseFloat(price);
        if (num >= 1000) {
            return num.toFixed(0);
        } else if (num >= 1) {
            return num.toFixed(2);
        }
        return num.toFixed(4);
    };

    const formatQuantity = (quantity: string) => {
        const num = parseFloat(quantity);
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toFixed(2);
    };

</script>

<section class="whale-container">
    <div class="whale-container__header">
        <h3>🐋 고래 청산 리스트</h3>
        <button class="whale-container__header__button"  on:click={handleWhaleSwitch}>그래프</button>
    </div>
    <div class="whale-container__list">
        {#if liquidationList && liquidationList.length > 0}
            {#each liquidationList as item, index}
                <div class="liquidation-item" class:latest={index === 0} class:latest-buy={index === 0 && item.side === 'BUY'} class:latest-sell={index === 0 && item.side === 'SELL'}>
                    <div class="main-row">
                        <div class="symbol-price">
                            <span class="symbol">{item.symbol}</span>
                            <span class="price">${formatPrice(item.price)}</span>
                        </div>
                        <div class="amount">{formatAmount(item.amount)}</div>
                        <div class="side" class:buy={item.side === 'SELL'} class:sell={item.side === 'BUY'}>
                            {item.side === 'BUY' ? 'SHORT' : 'LONG'}
                        </div>
                    </div>
                    <div class="sub-row">
                        <span class="quantity">{formatQuantity(item.quantity)}</span>
                        <span class="time">{convertToKSTTimeOnly(item.time)}</span>
                    </div>
                </div>
            {/each}
        {:else}
            <div class="empty-state">
                <p>청산 데이터가 없습니다</p>
            </div>
        {/if}
    </div>
</section>

<style lang="scss">
    @use "./whaleContainer.scss";
    @use "./LiquidationList.scss";
</style>