<script lang="ts">
    import Editor from "utils/Editor.svelte";
    import { handleGetPost, uploadImage } from "services/board";
    import { currentUrl, userInfo, writeBoard } from "stores/store";
    import { navigate } from "svelte-routing";
    import { got, urlParams } from "utils/helpers";
    import { compressImage, imageFormatter } from "utils/imageFormatter";
    import { popup } from "utils/popup";
    import { getUserInfo } from "services/userInfo";
    import { type PostModel } from "models/board";

    let title: string = "123";
    let boardId: string;
    let content: string;
    let modifyContent: string;
    let postId: string;
    let post: PostModel;

    const init = async () => {
        currentUrl.set(window.location.pathname + window.location.search);
        postId = urlParams("post");
        if (urlParams("id")) {
            boardId = urlParams("id");
            let post = await handleGetPost(Number(postId));
            if (!$userInfo || $userInfo["id"] !== post.user.id) {
                return navigate("/");
            }
            title = post.title;
            modifyContent = post.content;
        }
    };

    const onTextChange = async (event: any) => {
        let newContent = event.detail.html;

        const parser = new DOMParser();
        const doc = parser.parseFromString(newContent, "text/html");
        const imgTags = doc.querySelectorAll("img");
        let isUpdated = false;

        for (const img of imgTags) {
            const src = img.getAttribute("src");
            if (src && src.startsWith("data:image")) {
                const compressedSrc = await compressImage(src);
                const serverPath = await uploadImage(compressedSrc);
                if (serverPath) {
                    img.setAttribute("src", serverPath);
                    img.setAttribute("alt", title);
                    isUpdated = true;
                }
            }
        }

        if (isUpdated) {
            content = doc.body.innerHTML;
            modifyContent = content;
        } else {
            content = newContent;
        }
    };

    const handleSubmit = async () => {
        let params = {
            title,
            content,
            post,
            thumbnailURL: null,
        };

        const formatContent = await imageFormatter(title, content);
        if (formatContent?.status == true) {
            params["thumbnailURL"] = formatContent["thumbnail"];
        }

        const response = await got({
            urlParams: `/post/create/?boardId=${boardId}`,
            method: "POST",
            setParams: params,
        });

        if (response.statusCode == 1) {
            await getUserInfo();
            navigate(`/${$writeBoard}?post=${post}&id=${response.data.postId}`);
        } else {
            popup(response.message, response.statusCode);
        }
    };

    const handleUpdateSubmit = async () => {
        let params = {
            postId,
            title,
            content,
            thumbnailURL: null,
        };

        const formatContent = await imageFormatter(title, content);
        if (formatContent?.status == true) {
            params["thumbnailURL"] = formatContent["thumbnail"];
        }

        const response = await got({
            urlParams: "/post",
            method: "PATCH",
            setParams: params,
        });
        if (response.statusCode !== 1) {
            popup(response.message, response.statusCode);
        } else {
            history.go(-1);
        }
    };

    init();
</script>

<form
    class="content edit"
    on:submit|preventDefault={() => {
        postId ? handleUpdateSubmit() : handleSubmit();
    }}
>
    <div class="edit__title">
        <input
            bind:value={title}
            type="text"
            class="edit__title__input"
            required
            placeholder="제목을 입력해 주세요."
        />
    </div>
    <Editor {onTextChange} data={modifyContent} />
    <div class="edit__form">
        <button
            type="button"
            class="black line medium"
            on:click={() => {
                history.go(-1);
            }}>뒤로가기</button
        >
        <button type="submit" class="medium">
            {postId ? "수정하기" : "등록하기"}
        </button>
    </div>
</form>

<style lang="scss">
    @use "./BoardWriter.scss";
</style>
