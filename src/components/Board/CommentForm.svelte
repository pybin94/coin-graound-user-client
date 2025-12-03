<script lang="ts">
    import type { Post, Comment } from "constants/board";
    import { userInfo } from "stores/store";
    import { dateFormat, dateFromatSimple, got } from "utils/helpers";
    import { popup } from "utils/popup";

    export let post: any;

    let comment: HTMLTextAreaElement;
    let replyComment: string;
    let commentList: Array<Comment>;

    const init = () => {
        handleGetComment();
    };

    const testareaResize = (event: any) => {
        comment.style.height = 0 + "px";
        if (event.keyCode == 13) {
            comment.style.height = 15 + comment.scrollHeight + "px";
        };
        comment.style.height = 15 + comment.scrollHeight + "px";
    };

    const handleGetComment = async (): Promise<Comment> => {

        let params = {
            postId: post.id,
        };

        const response = await got({
            urlParams: "/comment",
            method: "POST",
            setParams: params
        });
        if(response.statusCode == 1) {
            return commentList = response.data;
        };
    }

    const handleSubmitComment = async (parentId?: number) => {

        if(!$userInfo) {
            return popup("로그인을 해주세요.");
        };

        let params = {
            postId: post.id,
            content: comment.value,
        }

        if(parentId) {
            if (!replyComment) return popup("내용을 입력해주세요.", 0);
            params["parentId"] = parentId
            params["replyComment"] = replyComment
        } else {
            if (!comment.value) return popup("내용을 입력해주세요.", 0);
        }

        const response = await got({
            urlParams: "/comment/create",
            method: "POST",
            setParams: params
        });
        if(response.statusCode == 1) {
            comment.value = ""
            document.querySelectorAll(".comment-covor").forEach((itme)=>{
                replyComment = null;
                itme.remove();
            })

            handleGetComment();
        } else {
            popup(response.message, response.statusCode);
        }
    }

    const createCommentInput = async (e: any, parentId: number) => {

        if(!$userInfo) {
            return;
        }

        const setNode = e.target.parentNode.parentNode.parentNode
        const element = `
            <div class="comment-covor">
                <div class="comment__text-box border">
                    <p class="comment__text-box__nickname">
                        ${$userInfo["nickname"]}
                    </p>
                    <textarea 
                        id="reply"
                        maxlength="400" 
                        placeholder="댓글을 남겨보세요."
                    ></textarea>
                    <div class="comment__text-box__register">
                        <button id="replySubmit" 
                            class="small line"
                        >등록</button>
                    </div>
                </div>
            </div>
        `

        document.querySelectorAll(".comment-covor").forEach((itme)=>{
            replyComment = null;
            itme.remove();
        })
        setNode.insertAdjacentHTML("afterend", element)

        const replyElement = document.querySelector("#reply") as HTMLInputElement
        replyElement?.addEventListener("keyup", () => {
            replyComment = replyElement.value 
        })

        document.querySelector("#replySubmit")?.addEventListener("click", () => {
            handleSubmitComment(parentId)
        })
    }

    const handleDeleteComment = async (commentId: number) => {
        let params = {
            commentId
        }

        popup("댓글을 삭제하시겠습니까?", 3, async (data: boolean)=>{
            if(!data) return;

            const response = await got({
                urlParams: "/comment",
                method: "DELETE",
                setParams: params
            });
            if (response.statusCode == 1) {
                handleGetComment();
            }
            popup(response.message, response.statusCode)
        })

    }

    init();
</script>

<footer class="comment">
    <p class="comment__title">댓글 {commentList ? commentList.length : 0}</p>
    {#if commentList}
        {#each commentList as item}
            {#if !item.blockedAt}
                <div 
                    class="comment__content"
                >
                    <img class="comment__content__picture" src="{item.user.picture}" alt="유저 이미지">
                    <div class="comment__content__body">
                        <div class="comment__content__body__nickname">{item.user.nickname}</div>
                        <div 
                            class="comment__content__body__detail"
                        >
                            {item.content}
                        </div>
                        <div class="comment__content__footer"> 
                            <div class="comment__content__footer__date">{dateFromatSimple(item.createdAt)}</div>
                            {#if item.children}
                                <p class="comment__content__footer__recomment">답글 {item.children.length}</p>
                            {/if}
                            <button
                                class="comment__content__footer__comment-input"
                                on:click={(e)=>{createCommentInput(e, item.id)}}
                                on:keypress={(e)=>{createCommentInput(e, item.id)}}
                            >답글 쓰기</button>

                        </div>
                    </div>
                    {#if $userInfo && $userInfo["id"] == item.user.id}
                        <i 
                            on:click={()=>{handleDeleteComment(item.id)}}
                            class="comment__content__delete fa-solid fa-square-xmark"
                        ></i>
                    {/if}
                </div>
            {/if}
            {#if item.children}
                {#each item.children as children}
                    <div 
                        class="comment__content reply"
                    >
                        <img class="comment__content__picture" src="{children.user.picture}" alt="유저 이미지">
                        <div class="comment__content__body">
                            <div class="comment__content__body__nickname">{children.user.nickname}</div>
                            <div 
                                class="comment__content__body__detail"
                            >
                                {children.content}
                            </div>
                            <div class="comment__content__footer"> 
                                <div class="comment__content__footer__date">{dateFromatSimple(children.createdAt)}</div>
                            </div>
                        </div>
                        {#if $userInfo && $userInfo["id"] == children.user.id}
                            <i 
                                on:click={()=>{handleDeleteComment(children.id)}}
                                class="comment__content__delete fa-solid fa-square-xmark"
                            ></i>
                        {/if}
                    </div>
                {/each}
            {/if}
        {/each}
    {/if}
    <div class="comment__text-box border">
        {#if $userInfo}
            <p class="comment__text-box__nickname">
                {$userInfo["nickname"]}
            </p>
            <textarea 
                bind:this={comment}
                maxlength="400" 
                placeholder="댓글을 남겨보세요"
                on:keydown={(e)=>{testareaResize(e)}}
            ></textarea>
            <div class="comment__text-box__register">
                <button 
                    class="small line"
                    on:click={()=>{handleSubmitComment()}}
                >등록</button>
            </div>
        {:else}
            <a
                class="comment__text-box__nickname" 
                href="/joinin"
            >
                로그인 후 이용해주세요.
            </a>
        {/if}
    </div>
</footer>

<style lang="scss">
    @use "./CommentForm.scss";
</style>