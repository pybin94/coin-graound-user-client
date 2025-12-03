<script lang="ts">
    import { type SymbolInfo } from 'models/chart';
    import { nightMode } from 'stores/store';
    import { onDestroy, onMount } from 'svelte';

    export let symbolInfo: SymbolInfo;

    let symbol: string;
    let interval = "D"
    let container: HTMLDivElement;
    let theme = "white";
    let backgroundColor = "rgb(34, 34, 34)";

    const setNightMod = () => {
        if ($nightMode == "off") {
            theme = "dark"
            backgroundColor = "rgb(34, 34, 34)"
        } else {
            theme = "white"
            backgroundColor = "rgb(248, 249, 250)"
        }
        loadChart()
    }

    const setSymbol = () => {
        if(symbolInfo.p) {
            symbol = symbolInfo.p + ":" + symbolInfo.s + symbolInfo.cu;
            if(symbolInfo.ef) {
                symbol = symbolInfo.p + ":" + symbolInfo.s + symbolInfo.cu + "." + symbolInfo.ef;
                interval = "1"
            } else {
                interval = "D"
            }
        }
        loadChart();
    }

    const loadChart = () => {
        if (container) {
            container.innerHTML = "";
            
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.async = true;
            script.innerHTML = JSON.stringify({
                "width": "100%",
                "height": "100%",
                "symbol": symbol,
                "interval": interval,
                "timezone": "Asia/Seoul",
                "theme": theme,
                "style": "1",
                "locale": "kr",
                "backgroundColor": backgroundColor,
                "withdateranges": true,
                "hide_side_toolbar": false,
                "allow_symbol_change": false,
                "support_host": "https://www.tradingview.com",
            });

            container.appendChild(script);
        }
    };

    onMount(() => {
        loadChart();
    });

    onDestroy(() => {
        if (container) {
            container.innerHTML = "";
        }
    });

    setInterval(()=>{
        loadChart();
    }, 3600000)
    
    $: symbolInfo, setSymbol();
    $: $nightMode, setNightMod();
</script>

<section class="tradingview card">
    <div class="tradingview-widget-container" bind:this={container}>
        <div class="tradingview-widget-container__widget"></div>
    </div>
</section>

<style lang="scss">
    @use "./TradingView.scss";
</style>