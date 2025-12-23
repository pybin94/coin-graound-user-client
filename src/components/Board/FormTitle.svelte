<script lang="ts">
    import type { Post } from "constants/board";
    import { dateFormat } from "utils/helpers";

    export let post: Post
</script>

<header class="form-title">
    <h3 class="form-title__title">{post.title}</h3>
    <div class="form-title__info">
        <div class="form-title__info__user"> 
            <p>
                {post.user.nickname} 
                <span class="form-title__info__user__level">
                    {post.user.level}
                </span>
            </p>
            <p>{dateFormat(post.createdAt)}</p>
        </div>
        <div class="form-title__info__post">
            <p>조회 {post.viewCount}</p>
            <p>추천 {post.likeCount}</p>
            <p>비추천 {post.dislikeCount}</p>
        </div>
    </div>
</header>

<style lang="scss">
    @use "./FormTitle.scss";
</style>