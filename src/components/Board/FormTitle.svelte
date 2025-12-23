<script lang="ts">
    import { type PostModel } from "models/board";
    import { dateFormat } from "utils/helpers";

    export let post: PostModel;
</script>

<header class="form-title">
    <h3 class="form-title__title">{post.title}</h3>
    <div class="form-title__info">
        <div class="form-title__info__user">
            <p>
                {post.user.nickname}
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
