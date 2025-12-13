<script lang="ts">
    import { type NewsModel } from "models/news";
    import { timeAgo } from "utils/helpers";

    export let newsList: Array<NewsModel>;
    export let buttonVisible: boolean;
    export let hendleGetNewsList: any
</script>

<div class="news-list">
    {#if newsList && newsList.length > 0}
        {#each newsList as item}
            <article class="news-list__article">
                {#if item.images}
                <div class="news-list__article__image-wap">
                    {#each JSON.parse(item.images) as image}
                        <a href={`/src/assets/images/${image}`} target="_blank" rel="noopener noreferrer">
                            <div class="news-list__article__image {item.images && JSON.parse(item.images).length === 1 ? 'single' : 'multiple'}">
                                <img src={`/src/assets/uploads/news/${image}`} alt="postId">
                            </div>
                        </a>
                    {/each}
                </div>
                {/if}
                <div class="news-list__article__contents">
                    <p class="news-list__article__contents__text">{@html item.text}</p>
                    <div class="news-list__article__contents__time-ago">
                        <i class="fa-regular fa-clock"></i>
                        <span>{timeAgo(item.createdAt)}</span>
                    </div>
                </div>
            </article>
        {/each}
        {#if buttonVisible}
            <button 
                class="unset news-list__more"
                on:click={hendleGetNewsList}
            >
                더 많은 속보 보기
            </button>
        {:else}
            속보가 없습니다.
        {/if}
    {:else}
        {#each Array(7) as _}
            <article class="news-list__skeleton">
                <div class="news-list__skeleton__text" style="width:90%"></div>
                <div class="news-list__skeleton__text" style="width:80%"></div>
                <div class="news-list__skeleton__text" style="width:60%"></div>
            </article>
        {/each}
    {/if}
</div>


<style lang="scss">
    @use "./NewsList.scss";
</style>