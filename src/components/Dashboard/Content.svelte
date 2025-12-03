<script lang=ts>
    import type { Post } from "constants/board";
    import { link } from "svelte-routing";

    export let tableList: Array<Post>;
    export let title: string;
</script>

<section class="content box">
    <h2 class="content__title">
        <a use:link href="/">{title}</a>
    </h2>
    <ul class="content__list">
        {#if tableList && tableList.length != 0}
            {#each tableList as item}
                <li class="content__list__post">
                    <a use:link href="/board?board=free&post={item.id}">
                        <p>{item.title}</p>
                        <div class="content__list__comment">{item.comment.length}</div>
                    </a>
                </li>
            {/each}
        {:else}
            <li>게시글이 없습니다.</li>
        {/if}
    </ul>
</section>

<style lang="scss">
    @use "./Content.scss";
</style>