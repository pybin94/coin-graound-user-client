<script lang="ts">
    import { type FeedModel } from "models/board";
    import { type SymbolInfo, type TickerInfo } from "models/chart";
    import { userInfo } from "stores/store";
    import { onDestroy, onMount } from "svelte";
    import { got, handleError, moneyFormat, timeAgo } from "utils/helpers";
    import Modal from "utils/Modal.svelte";
    import { popup } from "utils/popup";

    export let symbolInfo: SymbolInfo;
    export let ticker: TickerInfo;

    const reportList = [
        {type: 1, content: "도배", icon: "fa-solid fa-radiation"},
        {type: 2, content: "욕설", icon: "fa-solid fa-gun"},
        {type: 3, content: "광고", icon: "fa-solid fa-baseball-bat-ball"},
        {type: 4, content: "부적절한 글", icon: "fa-solid fa-dog"},
    ]

    let contentRefs = {};
    let expandedItems = {};
    let content: HTMLTextAreaElement;
    let feedList: Array<FeedModel> = [];
    let sort: string = "like";
    let activeReportIndex = null;
    let isMenuOpen = false;
    let activeReportType = false;
    let setReportIten = null;

    const handleGetFeed = async (setSort: string = "like") => {
        sort = setSort;
        let symbol = `?symbol=${ticker?.id ? ticker.id : symbolInfo.id}&sort=${setSort}`;

        const response = await got({
            urlParams: `/feed${symbol}`,
        });
        if (response.statusCode == 1) {
            feedList = response.data;
        } else {
            popup(response.message, response.statusCode)
        }
    }

    const handleCreateFeed = async () => {
        if(!$userInfo) return;
        if(!content.value) return content.focus();

        const params = {
            coin: ticker?.id ? ticker.id : symbolInfo.id,
            content: content.value,
            price: `${moneyFormat(ticker.tp)} ${symbolInfo.cu}`,
        }

        const response = await got({
            urlParams: `/feed/create`,
            method: "POST",
            setParams: params
        });
        if (response.statusCode == 1) {
            feedList = [response.data, ...feedList];
            content.value = "";
        }
        return popup(response.message, response.statusCode)
    }

    const handleVoteLick = async (feedId: number) => {
        if(!$userInfo) return popup("로그인 후 이용해주세요");

        const params = {
            feedId,
        }

        const response = await got({
            urlParams: `/feed/vote`,
            method: "POST",
            setParams: params
        });
        if (response.statusCode == 1) {
            feedList.forEach((item)=>{
                if(item.id == feedId) item.likeCount++;
            })
            feedList = [...feedList]
        } else {
            return popup(response.message, response.statusCode)
        }
    }

    const handleMoreContent = (id: number) => {
        let el: HTMLDivElement = document.querySelector(`.content${id}`)
        if(el.scrollHeight == el.offsetHeight) {
            el.style.maxHeight = "82px";
            expandedItems[id] = false;
        } else {
            el.style.maxHeight = String(el.scrollHeight)+"px";
            expandedItems[id] = true;
        }
    }

    const handleClickOutside = () => {
        if(isMenuOpen) {
            activeReportIndex = null
            isMenuOpen = false;
            return;
        }

        if(activeReportIndex) {
            return isMenuOpen = true
        }
    }

    const setActiveReportIndex = (index = null) => {
        activeReportIndex = index
    }

    const toggleReportModal = () => {
        activeReportType = false
    }

    const handleReport = (item: FeedModel) => {
        activeReportType = true;
        setReportIten = item
    }

    const handlePostReport = (type: number) => {
        activeReportType = false
        let reportContent = setReportIten.content
        if(reportContent.length > 8) {
            reportContent = reportContent.substring(0, 8) + "..."
        }

        const params = {
            feedId: setReportIten.id,
            type: type,
        }

        popup(`신고글 "${reportContent}""`, 3, async (data) => {
            if (data == false) return;

            const response = await got({
                urlParams: `/feed/report`,
                method: "POST",
                setParams: params
            });
            return popup(response.message, response.statusCode)
        });
    }
    
    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onDestroy(() => {
        document.addEventListener('click', handleClickOutside);
    });


    $: symbolInfo, handleGetFeed();
</script>

<div class="card feed">
    <div class="feed__header">
        <img 
            class="feed__header__img" 
            src="https://s3-symbol-logo.tradingview.com/crypto/XTVC{symbolInfo.s}--big.svg" 
            alt="{symbolInfo.s} 아이콘"
            on:error={handleError}
        >
        <h3 class="feed__header__title">{ticker?.kr ? ticker.kr : symbolInfo.s} 피드</h3>
    </div>
    <ul class="feed__body">
        <div class="feed__textarea">
            <textarea bind:this={content} disabled={$userInfo ? false : true} placeholder={$userInfo ? "나만의 생각을 전달하세요." : "로그인 후 이용해주세요."}></textarea>
            <button type="button" on:click={handleCreateFeed}>남기기</button>
        </div>
        {#if feedList.length > 0}
            <div class="feed__sort-button">
                <button on:click={()=>{handleGetFeed("like")}} class:line={sort == "createdAt"} class="dark">인기순</button>
                <button on:click={()=>{handleGetFeed("createdAt")}} class:line={sort == "like"} class="dark">최신순</button>
            </div>
            {#each feedList as item, index}
                <li class="feed__body__list">
                    <div class="feed__body__left">
                        <div class="feed__body__list__picture">
                            {#if item.user.picture}
                                <img src={item.user.picture} alt="프로필 이미지">
                            {:else}
                                <img src="/src/assets/uploads/profile/none{item.user.id % 5}.png" alt="프로필 이미지">
                            {/if}
                        </div>
                        <div class="feed__body__list__recomend" on:click={()=>{handleVoteLick(item.id)}}>
                            <i class="fa-solid fa-caret-up"></i>
                            <p>{item.likeCount}</p>
                        </div>
                    </div>
                    <div class="feed__body__right">
                        <div class="feed__body__list__header">
                            <h5  class="feed__body__list__header__nickname">{item.user.nickname}</h5>
                            <i class="fa-solid fa-ellipsis-vertical" on:click={()=>{setActiveReportIndex(index + 1)}}></i>
                            {#if activeReportIndex == index + 1}
                                <div class="feed__body__list__header__report" on:click={()=>{handleReport(item)}}>
                                    신고
                                </div>
                            {/if}
                        </div>
                        <div 
                            class="feed__body__list__content content{item.id}"
                            bind:this={contentRefs[item.id]}
                        >
                            {@html item.content}
                        </div>

                        {#if Object.keys(contentRefs).length && contentRefs[item.id]?.scrollHeight > 82}
                            <button 
                                class="unset feed__body__list__more-button"
                                on:click={()=>{handleMoreContent(item.id)}}
                            >
                                {expandedItems[item.id] ? "접기" : "더보기"} 
                            </button>
                        {/if}

                        <div class="feed__body__list__footer">
                            <p class="feed-date">
                                {timeAgo(item.createdAt)}
                                {#if item.updatedAt}
                                    (수정됨)
                                {/if}
                            </p>
                            <div class="feed__body__list__footer__line"></div>
                            <p class="feed-price">{item.price}</p>
                        </div>
                    </div>
                </li>
            {/each}
        {:else}
            <li class="feed__body__list">작성된 피드가 없습니다.</li>
        {/if}
    </ul>
</div>

<Modal
    visible={activeReportType}
    handleVisible={toggleReportModal}
>
    <ul class="feed-report">
        {#each reportList as item}
            <li class="feed-report__list" on:click={()=>{handlePostReport(item.type)}}>
                <i class="{item.icon} feed-report__list__icon"></i>
                <p>{item.content}</p>
            </li>
        {/each}
        <li class="feed-report__list feed-report__cancel" on:click={toggleReportModal}>
            <i class="fa-brands fa-btc feed-report__list__icon"></i>
            <p>취소</p>
        </li>
    </ul>
</Modal>

<style lang="scss">
    @use "./Feed.scss";
</style>