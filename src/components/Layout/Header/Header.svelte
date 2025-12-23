<script lang="ts">
    import { menus } from "constants/layout";
    import { type ExchangeRateDataModel } from "models/exchangeRate";
    import { userInfo, nightMode, usDollerPrice, currentIndex } from "stores/store";
    import { onDestroy, onMount } from "svelte";
    import { link } from "svelte-routing"
    import { getCookie, handleImageError, setCookie } from "utils/helpers";

    let header: HTMLHeadElement;
    let exchangeRateData: ExchangeRateDataModel;
    let exchangeRateList = ["USD/KRW", "USDINDEX", "KOSPI", "NASDAQ", "S&P500"]
    
    // 슬라이드 관련 변수들
    let currentSlideIndex: number = 0;
    let slideInterval: ReturnType<typeof setInterval>;
    let isMobile: boolean = false;

    const init = () => {
        eventSource = new EventSource(process.env.DATA_PIPELINE_URL + "/sse/exchnge-rate");

        eventSource.onmessage = (e) => {
            const data = JSON.parse(JSON.parse(e.data));
            exchangeRateData = data;
            usDollerPrice.set(exchangeRateData["USD/KRW"].price as number)
        };

        eventSource.onerror = () => {
            console.log("SSE connection error.");
        };
    }

    // 슬라이드 기능 초기화
    const initSlide = () => {
        const width = window.innerWidth;
        isMobile = width <= 1200;
        
        if (isMobile) {
            startSlideInterval();
        } else {
            stopSlideInterval();
        }
    }

    // 슬라이드 인터벌 시작
    const startSlideInterval = () => {
        stopSlideInterval();
        slideInterval = setInterval(() => {
            currentSlideIndex = (currentSlideIndex + 1) % exchangeRateList.length;
        }, 5000);
    }

    // 슬라이드 인터벌 정리
    const stopSlideInterval = () => {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    // const menuHighlight = () => {
    //     const currentPath = window.location.pathname;
        
    //     if (currentPath !== lastPathname) {
    //         lastPathname = currentPath;
            
    //         currentIndex.set(0);
            
    //         for(let i = 0; i < menus.length; i++) {
    //             if(currentPath === menus[i].url) {
    //                 currentIndex.set(i);
    //                 break;
    //             }
    //         }
            
    //         currentUrl.set(currentPath);
    //     }
    // }
    
    let eventSource: EventSource | null = null;

    onMount(() => {
        // SSE 초기화
        init();
        
        // window.addEventListener("scroll", () => {setHeaderPosition()})
        window.addEventListener("resize", initSlide);

        initSlide();
    })

    onDestroy(() => {
        // SSE 연결 종료
        if (eventSource) {
            eventSource.close();
        }
    
        // window.removeEventListener("scroll", () => {setHeaderPosition()})
        window.removeEventListener("resize", initSlide);
        stopSlideInterval();
    })
    
    const handleNightMode = ():void => {
        if (!getCookie("nightMode") || getCookie("nightMode") == "off") {
            setCookie("nightMode", "on")
            nightMode.update(() => "on")
        } else {
            setCookie("nightMode", "off")
            nightMode.update(() => "off")
        }
    }

    const convertExchangeRateName = (name: string) => {
        if (name == "USD/KRW") return "USD / KRW";
        if (name == "USDINDEX") return "USD INDEX";
        if (name == "S&P500") return "S&P 500";
        return name;
    }
</script>

<header class="header" bind:this={header}>
    <div class="header__wrap wrap exchange-wrap">
        {#if exchangeRateData}
            {#if isMobile}
                <!-- 모바일: 슬라이드 효과 -->
                <div class="header__exchange-rate-slider">
                    {#each exchangeRateList as item, index}
                        <div class="header__exchange-rate" 
                             class:active={index === currentSlideIndex}
                             class:slide-up={index === currentSlideIndex}
                             style="transform: translateY({(index - currentSlideIndex) * 100}%)">
                            <div class="header__exchange-rate__name">{convertExchangeRateName(item)}</div>
                            <div class="header__exchange-rate__price">{exchangeRateData[item].price}</div>
                            {#if exchangeRateData[item].scp >= 0}
                                <div class="red header__exchange-rate__percent">{exchangeRateData[item].scp}</div>
                                <div class="red  header__exchange-rate__percent">
                                    <i class="fa-solid fa-caret-up up"></i>
                                    {exchangeRateData[item].scr}
                                </div>
                            {:else}
                                <div class="blue header__exchange-rate__percent">{exchangeRateData[item].scp}</div>
                                <div class="blue  header__exchange-rate__percent">
                                    <i class="fa-solid fa-caret-down down"></i>
                                    {exchangeRateData[item].scr}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {:else}
                <!-- 데스크톱: 기존 방식 -->
                {#each exchangeRateList as item}
                    <div class="header__exchange-rate">
                        <div class="header__exchange-rate__name">{convertExchangeRateName(item)}</div>
                        <div class="header__exchange-rate__price">{exchangeRateData[item].price}</div>
                        {#if exchangeRateData[item].scp >= 0}
                            <div class="red header__exchange-rate__percent">{exchangeRateData[item].scp}</div>
                            <div class="red">
                                <i class="fa-solid fa-caret-up up"></i>
                                {exchangeRateData[item].scr}
                            </div>
                        {:else}
                            <div class="blue header__exchange-rate__percent">{exchangeRateData[item].scp}</div>
                            <div class="blue">
                                <i class="fa-solid fa-caret-down down"></i>
                                {exchangeRateData[item].scr}
                            </div>
                        {/if}
                    </div>
                {/each}
            {/if}
        {/if}
    </div>
    <div class="header__wrap wrap">
        <a class="header__logo" use:link href="/">
            <img class="header__logo__icon" src="/src/assets/logo.png" alt="">
        </a>
        <ul class="header__menu">
            {#each menus as item, index}
                <li class="header__menu__list">
                    <a 
                        class="header__menu__list__title" class:menu-active={$currentIndex == index} 
                        use:link 
                        href={item.url}
                        on:click={()=>{$currentIndex = index}}
                    >
                        {item.title}
                    </a>
                </li>
            {/each}
        </ul>
        <div class="header__right">
            <button on:click={handleNightMode} class="unset header__right__dark-mode">
                {#if $nightMode == "on"}
                    <i class="fa-solid fa-moon"></i>
                {:else}
                    <i class="fa-solid fa-sun"></i>
                {/if}
            </button>
            {#if $userInfo}
                <a class="header__right__myinfo" use:link href="/mypage/profile" on:click={()=>{$currentIndex = -1}}>
                    {#if JSON.parse($userInfo)["picture"]}
                        <img 
                            src={JSON.parse($userInfo)["picture"]} alt="프로필 이미지"
                            on:error={(e)=>{handleImageError(e, `/src/assets/uploads/profile/none${JSON.parse($userInfo)["id"] % 5}.png`)}}
                        >
                    {:else}
                        <img src="/src/assets/uploads/profile/none{JSON.parse($userInfo)["id"] % 5}.png" alt="프로필 이미지">
                    {/if}
                </a>
            {:else}
                <a class="header__right__joinin" use:link href="/joinin" on:click={()=>{$currentIndex = -1}}>
                    <i class="fa-solid fa-user"></i>
                </a>
            {/if}
        </div>
    </div>
</header>

<style lang="scss">
    @use "./Header.scss";
</style>