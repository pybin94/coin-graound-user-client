<script lang="ts">
    import { type OceanSignalModel } from "models/dashboard";
    import { onDestroy, onMount } from "svelte";
    import { convertToKSTTimeOnly, moneyFormat } from "utils/helpers";
    import { popup } from "utils/popup";

    let oceanSignal: OceanSignalModel[] = [];
    
    let evt: EventSource | null = null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        popup("복사되었습니다.");
    }

    const formatTxHash = (hash: string) => {
        if (!hash || typeof hash !== 'string') {
            return 'Unknown';
        }
        if (hash.length <= 16) {
            return hash;
        }
        return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
    };

    const handleGetOceanSignal = () => {
        evt = new EventSource(process.env.DATA_PIPELINE_URL + "/sse/ocean-signal");

        evt.onmessage = (e) => {
            try {
                const data = JSON.parse(JSON.parse(e.data));
                oceanSignal = data;
            } catch (error) {
                console.error('JSON 파싱 오류:', error);
            }
        };

        evt.onerror = () => {
            console.log("SSE connection error.");
        };
    }

    onMount(() => {
        handleGetOceanSignal();
    });

    onDestroy(() => {
        if (evt) {
            evt.close();
            evt = null;
        }
    });

</script>

<section class="whale-container">
    <div class="whale-container__header">
        <h3>🌊 고래 지갑 이동</h3>
    </div>
    
    <div class="whale-container__list">
        {#if oceanSignal && oceanSignal.length > 0}
            {#each oceanSignal as signal, index}
                <div class="ocean-signal-item" class:latest={index === 0}>
                    <div class="main-row">
                        <div class="amount-info">
                            <span class="amount">{moneyFormat(signal.amount)}</span>
                        </div>
                        <div class="time">{convertToKSTTimeOnly(signal.timestamp)}</div>
                    </div>
                    <div class="sub-row">
                        <span class="tx-hash" on:click={() => copyToClipboard(signal.txHash)} title="클릭 시 복사">
                            <i class="fa-solid fa-hashtag"></i>
                            {formatTxHash(signal.txHash)}
                        </span>
                    </div>
                </div>
            {/each}
        {:else}
            <div class="empty-state">
                <p>Ocean Signal 데이터가 없습니다</p>
            </div>
        {/if}
    </div>
</section>

<style lang="scss">
    @use "./whaleContainer.scss";
    @use "./OceanSignal.scss";
</style>