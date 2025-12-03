<script lang="ts">
    import type { Post } from "constants/board";
    import { onMount } from "svelte";
    import { got } from "utils/helpers";
    import { popup } from "utils/popup";

    export let post: Post;

    enum VoteType {
        LIKE = 1,
        DISLIKE = 2,
    }

    let postId = post.id
    let like = post.likeCount;
    let dislike = post.dislikeCount;
    let image: string;
    let imageModal: boolean = false;

    onMount(()=>{
        if (post.content) {
            const images = document.querySelectorAll(".view-form img");
            images.forEach((item: HTMLImageElement) => {
                item.addEventListener("click", () => {
                    let divElement = document.createElement('div');
                    let imageElement = document.createElement('img');
                    const src = item.getAttribute('src');
                    imageElement.setAttribute('src', src);
                    divElement.append(imageElement)
                    image = divElement.innerHTML
                    toggleImageModal()
                }); 
            })
        }
    })
    
    const toggleImageModal = () => {
        imageModal = !imageModal
    }
    
    const handleVoteCount = async (voteTpye: VoteType) => {

        let params = {
            voteTpye,
            postId,
        }

        const response = await got({
            urlParams: "/post/vote",
            method: "POST",
            setParams: params
        });
        if(response.statusCode == 1) {
            voteTpye == VoteType.LIKE ? like++ : dislike++;
        } else {
            popup(response.message, response.statusCode)
        }
    }

</script>

<div class="view-form ql-editor">
    {@html post.content}
    <div class="view-form__recommend">
        <div class="view-form__recommend__box">
            <p class="view-form__recommend__box__count like">{like}</p>
            <div
                on:click={()=>{
                    handleVoteCount(VoteType.LIKE)
                }}
                on:keypress={() => {
                    handleVoteCount(VoteType.LIKE)
                }}
                class="view-form__recommend__box__like"
            >
                <i class="fa-solid fa-caret-up"></i>추천
            </div>
            <div 
                on:click={()=>{
                    handleVoteCount(VoteType.DISLIKE)
                }}
                on:keypress={()=>{
                    handleVoteCount(VoteType.DISLIKE)
                }}
                class="view-form__recommend__box__dislike"
            >
                <i class="fa-solid fa-caret-down"></i>비추
            </div>
            <p class="view-form__recommend__box__count dislike">{dislike}</p>
        </div>
        <div class="view-form__recommend__button-box">
            <div class="view-form__recommend__button-box__share">
                <i class="fa-solid fa-share-nodes"></i>공유
            </div>
            <div class="view-form__recommend__button-box__declaration">
                <i class="fa-solid fa-triangle-exclamation"></i>신고
            </div>
        </div>
    </div>
</div>

{#if imageModal}
    <div 
        class="image-modal-cover"
        on:click={toggleImageModal}
    ></div>        
    <div class="image-modal">
        <button 
            class="image-modal__xmark"
            on:click={toggleImageModal}
        >
            <i class="fa-solid fa-xmark"></i>
        </button>
        {@html image}
    </div>
{/if}

<style lang="scss">
    @use "./ViewForm.scss";
</style>