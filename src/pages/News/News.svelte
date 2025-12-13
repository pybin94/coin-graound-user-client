<script lang="ts">
    import BreakingAlert from "components/News/BreakingAlert.svelte";
    import NewsList from "components/News/NewsList.svelte";
    import { type NewsModel } from "models/news";
    import { onDestroy, onMount } from "svelte";
    import { got } from "utils/helpers";
    import MenuHeader from "components/Layout/MenuHeader/MenuHeader.svelte";
    import { type MenuHeaderModel } from "models/layout";

    const menuHeader: MenuHeaderModel = {
        icon: "fa-solid fa-arrow-trend-up",
        title: "코인 속보",
        subTitle: "실시간 암호화폐 뉴스",
        extraHTML: `<i class="fa-regular fa-clock"></i><p>실시간 업데이트</p>`,
    }

    let evt: EventSource | null = null;
    let seeNews: Array<NewsModel>  = [];
    let newsList: Array<NewsModel> = [];
    let pendingNews: Array<NewsModel> = [];
    let scrollY = 0;
    let breakingAlertCheck = false;
    let currentPage: number = 1;
    let limit: number = 10;
    let offset: number = limit * currentPage-1;
    let buttonVisible: boolean = true

    const hendleGetNewsList = async () => {
        offset = limit * (currentPage-1);

        let params = {
            limit,
            offset,
        };

        const response = await got({
            urlParams: "/news/list",
            method: "POST",
            setParams: params,
        })

        if(response.statusCode == 1) {
            const responseList = response.data.list;

            pendingNews = [...pendingNews, ...responseList];
            newsList = [...newsList, ...responseList];

            if(response.data.total > limit * currentPage) {
                currentPage++;
            } else {
                buttonVisible = false
            };
        };

    }

    hendleGetNewsList()

    const handleGetNews = () => {
        evt = new EventSource(process.env.DATA_PIPELINE_URL + "/sse/news");

        evt.onmessage = (e) => {
            try {
                const response = JSON.parse(e.data);
                seeNews = response as Array<NewsModel>

                pendingNews = [...seeNews, ...newsList]

                if(scrollY <= 250 ) {
                    newsList = [...seeNews, ...newsList]
                }
                if(scrollY > 250) {
                    breakingAlertCheck = true;
                };

            } catch (error) {
                console.error('JSON 파싱 오류:', error);
            }
        };

        evt.onerror = () => {
            console.log("SSE connection error.");
        };
    }

    const handleScroll = () => {
        scrollY = window.scrollY;
        if(scrollY < 125 && breakingAlertCheck == true) {
            newsList = pendingNews
            breakingAlertCheck = false
        }
    };

    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    onMount(() => {
        handleGetNews();

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });

    onDestroy(() => {
        if (evt) {
            evt.close();
            evt = null;
        }
    });

    $: newsList

</script>

<main class="news content">
    <MenuHeader {menuHeader} />
    <BreakingAlert {breakingAlertCheck} {handleScrollTop} />
    <NewsList {newsList} {buttonVisible} {hendleGetNewsList} />
</main>

<style lang="scss">
    @use "../../styles/animation.scss";
    @use "./News.scss";
</style>