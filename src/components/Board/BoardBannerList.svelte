<script lang="ts">
    import type { Post } from "constants/board";
    import { postParams } from "stores/store";
    import { link, navigate } from "svelte-routing";
    import { boardDateFormat } from "utils/helpers";

    export let tableList: Array<Post>;
    export let handleSetPost: Function;
    export let boardName: string;
</script>

{#each tableList as item, index}
    <tr class="board-list {item.id == $postParams ? "active" : ""}">
        <a  
            class="board-list__link"
            use:link href="?board={boardName}&post={item["id"]}"
            on:click={()=>{
                if (item.id != $postParams) {
                    handleSetPost(item["id"])
                }
            }}
            on:keypress={()=>{
                if (item.id != $postParams) {
                    handleSetPost(item["id"])
                }
            }}
        >   
            {#each item.postMeta as postMeta}
                {#if postMeta.type == "IMG"} 
                    <td class="board-list__banner"><img src="{postMeta.value}" alt="배너 이미지"></td>
                {/if}
            {/each}
            {#each item.postMeta as postMeta}
                {#if  postMeta.priority == 1 }
                    <td>{postMeta.value}</td>
                {/if}
            {/each}
            {#each item.postMeta as postMeta}
                {#if postMeta.priority == 2}
                    <td 
                        class="board-list__shortcuts"
                        on:click={()=>{navigate(`https://${postMeta.value}`)}}
                    >바로가기</td>
                {/if}
            {/each}
            <td
                class="board-list__title"
            >
                <div class="board-list__title__text">{item.title}</div>
                {#if item["thumbnailURL"]}
                    <i class="fa-solid fa-image board-list__title__image-icon"></i>
                {/if}
                <div class="board-list__title__comments">[{item.comment.length}]</div>
            </td>
            <td>{boardDateFormat(item["createdAt"])}</td>
        </a>
    </tr>
{/each}

<style lang="scss">
    @use "./BoardBannerList.scss";
</style>