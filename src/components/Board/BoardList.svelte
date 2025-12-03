<script lang="ts">
    import { postParams } from "stores/store";
    import { link } from "svelte-routing";
    import { boardDateFormat } from "utils/helpers";

    export let tableList: Array<object>;
    export let handleSetPost: Function;
    export let boardName: string;
</script>

{#each tableList as item, index}
    <tr class="board-list {item["id"] == $postParams ? "active" : ""}">
        <td>
            {#if item["id"] == $postParams} 
                <i class="board-list__active-board fa-solid fa-angle-right"></i>
            {:else}
                {item["id"]}
            {/if}
        </td>
        <td
            class="board-list__title"
        >
            <a 
                use:link href="?board={boardName}&post={item["id"]}"
                on:click={()=>{
                    if (item["id"] != $postParams) {
                        handleSetPost(item["id"])
                    }
                }}
                on:keypress={()=>{
                    if (item["id"] != $postParams) {
                        handleSetPost(item["id"])
                    }
                }}
            >   
                <div class="board-list__title__text">{item["title"]}</div>
                {#if item["thumbnailURL"]}
                    <i class="fa-solid fa-image board-list__title__image-icon"></i>
                {/if}
                <div class="board-list__title__comments">[{item["comment"].length}]</div>
            </a>
        </td>
        <td>{item["user"]["nickname"]}</td>
        <td>{boardDateFormat(item["createdAt"])}</td>
        <td>{item["viewCount"]}</td>
        <td>{item["likeCount"] - item["dislikeCount"]}</td>
        {#if item["thumbnailURL"]}
            <div class="board-list__thumbnail">{@html item["thumbnailURL"]}</div>
        {/if}
    </tr>
{/each}

<style lang="scss">
    @use "./BoardList.scss";
</style>