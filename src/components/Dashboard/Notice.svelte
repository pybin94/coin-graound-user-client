<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { link } from "svelte-routing";
    import { got } from "utils/helpers";

    const noticeSliderStartSpeed = 10000;
    const noticeSliderEndSpeed = 500;

    let noticeList: Array<object>;
    let noticeSlider: HTMLElement;
    let noticeInterval: any; 

    const init = () => {
        // handleNoticeList();
    }

    onMount(()=>{
        noticeSlider = document.querySelector(`#noticeSlider`)
        noticeInterval = setInterval(noticeSliderStart, noticeSliderStartSpeed)
    })

    onDestroy(() => {
        clearInterval(noticeInterval);
    });
    
    const handleNoticeList = async () => {
        let params = {
            limit: 99,
            offset: 0,
            boardName: "notification",
        }

        const response = await got({
            urlParams: "/post/list",
            method: "POST",
            setParams: params
        });
        if(response.statusCode == 1) {
            noticeList = response.data.list
        }
    }

    const noticeSliderStart = () => {
        if(!noticeList || noticeList && noticeList.length <= 1) return;
        noticeSlider.classList.add("transition")
        noticeSlider.style.transform = `translateY(${-((noticeSlider.scrollHeight / noticeList.length))}px)`
 
        setTimeout(noticeSliderEnd, noticeSliderEndSpeed)
    }

    const noticeSliderEnd = ()=>{
        const sliderContents: NodeList = document.querySelectorAll(`#noticeSlideContent`);
        
        noticeSlider.appendChild(sliderContents[0]);
        noticeSlider.classList.remove("transition");
        noticeSlider.style.transform = `translateY(0)`;
    };

    init()
</script>

<section class="notice box">
    <ul 
        id="noticeSlider" 
        class="notice__list"
    >
        {#if noticeList && noticeList.length !== 0}
            {#each noticeList as item}
                <li id="noticeSlideContent" class="notice__list__content">
                    <i class="notice__list__content__icon"></i>
                    <a  href="/board?board=notification&post={item["id"]}" use:link>{item["title"]}</a>
                </li>
            {/each}
        {:else}
            <li class="notice__list__content">공지가 없습니다.</li>
        {/if}
    </ul>
</section>

<style lang="scss">
    @use "./Notice.scss";
</style>