<script lang="ts">
 import { type FeedModel } from "models/board";
    import MyPage from "pages/MyPage/MyPage.svelte";
    import { got, timeAgo } from "utils/helpers";
    import Pagenation from "utils/Pagenation.svelte";
    import { popup } from "utils/popup";

    let myFeedList: Array<FeedModel>;
    let currentPage: number = 1;
    let limit: number = 10;
    let offset: number = limit * currentPage-1;
    let fullPage: number = 1;

    const init = async () => {
        handleGetMyFeed()
    }

    const handleGetMyFeed = async () => {

        offset = limit * (currentPage-1);

        let params = {
            limit,
            offset,
        };

        const response = await got({
            urlParams: "/board/mypage",
            method: "POST",
            setParams: params,
        })
        
        if (response.statusCode == 1){
            myFeedList = response.data.list;
            response.data.total == 0
            ? fullPage = 1
            : fullPage = Math.ceil(response.data.total / limit);
        } else {
            // popup(response.message, response.statusCode)
        }
    }

    init();

</script>
<MyPage>
    <ul class="my-feed">
        {#if myFeedList && myFeedList.length > 0}
            {#each myFeedList as item, index}
                <li class="my-feed__list">
                    <div class="my-feed__list__header">
                        <p>{item.coin.symbol}</p>
                        <p>{item.price}</p>
                        <p class="my-feed__list__header__like">추천 {item.likeCount}</p>
                        <p class="my-feed__list__header__date">{timeAgo(item.createdAt)}</p>
                    </div>
                    <div class="my-feed__list__body">
                        <p class="my-feed__list__body__content">{@html item.content}</p>
                    </div>
                </li>
            {/each}
        {:else}
            <li class="my-feed__list">
                <p class="my-feed__list__none">작성된 게시글이 없습니다.</p>
            </li>
        {/if}
    </ul>
</MyPage>

{#if myFeedList && myFeedList.length > 0}
    <Pagenation handleGetList={handleGetMyFeed} {fullPage} {currentPage} />
{/if}
<style lang="scss">
    @use "./Posts.scss";
</style>