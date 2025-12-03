<script lang="ts">
    import { currentUrl } from "stores/store";
    import Premium from "components/Dashboard/Premium.svelte";
    import OceanSignal from "components/Dashboard/OceanSignal.svelte";
    import Calculate from "components/Dashboard/Calculate.svelte";
    import { type WhaleLiquidationModel, type WhaleLiquidationSummaryModel } from "models/dashboard";
    import { onDestroy, onMount } from "svelte";
    import LiquidationList from "components/Dashboard/LiquidationList.svelte";
    import LiquidationGraph from "components/Dashboard/LiquidationGraph.svelte";
    
    let evt: EventSource | null = null;
    let liquidationList: WhaleLiquidationModel[] = [];
    let liquidationSummary: Record<string, WhaleLiquidationSummaryModel[]> = {};
    let whaleSwitch = true
    let browserWidth = window.innerWidth;

    currentUrl.set(window.location.pathname + window.location.search)

    const handleGetWhaleLiquidation = () => {
        evt = new EventSource(process.env.DATA_PIPELINE_URL + "/sse/whale-liquidations");

        evt.onmessage = (e) => {
            try {
                const liquidation = JSON.parse(e.data);
                liquidationList = liquidation[0]
                liquidationSummary = liquidation[1]
            } catch (error) {
                console.error('JSON 파싱 오류:', error);
            }
        };

        evt.onerror = () => {
            console.log("SSE connection error.");
        };
    }

    const handleWhaleSwitch = () => {
        whaleSwitch = !whaleSwitch
    }

    const updateBrowserWidth = () => {
        browserWidth = window.innerWidth;
    }

    onMount(() => {
        handleGetWhaleLiquidation();

        updateBrowserWidth();  // 초기 사이즈

        window.addEventListener("resize", updateBrowserWidth);

        return () => {
            window.removeEventListener("resize", updateBrowserWidth);
        };
    });

    onDestroy(() => {
        if (evt) {
            evt.close();
            evt = null;
        }

        window.removeEventListener("resize", updateBrowserWidth);
    });

</script>

<div class="dashboard content">
    <div class="dashboard__premium section">
        <Premium />
    </div>
    <div class="dashboard__whale section">
        {#if browserWidth > 978}
            <LiquidationList {liquidationList} {handleWhaleSwitch} />
            <LiquidationGraph {liquidationSummary} {handleWhaleSwitch} />
        {:else}
            {#if whaleSwitch}
                <LiquidationGraph {liquidationSummary} {handleWhaleSwitch} />
            {:else}
                <LiquidationList {liquidationList} {handleWhaleSwitch} />
            {/if}
        {/if}
        <OceanSignal />
    </div>
    <div class="dashboard__calculate section">
        <Calculate />
    </div>
    <!-- <Notice />
    <div class="dashboard__contents">
        <Content tableList={freeList} title={"자유게시판"} />
    </div> -->
</div>

<style lang="scss">
    @use "./Dashboard.scss";
</style>