<script lang=ts>
    import Editor from "utils/Editor.svelte";
    import { handleGetPost } from "services/board";
    import { getUserInfo } from "services/userInfo";
    import { currentUrl, userInfo, writeBoard } from "stores/store";
    import { navigate } from "svelte-routing";
    import { got, urlParams } from "utils/helpers";
    import { imageFormatter } from "utils/imageFormatter";
    import { popup } from "utils/popup";

    let title: string = "123";
    let postId: number;
    let content: string;
    let modifyContent: string;
    let boardName: string;

    const init = async () => {
        currentUrl.set(window.location.pathname + window.location.search)
        boardName = urlParams("board")
        if(urlParams("post")) {
            postId = parseInt(urlParams("post"))
            let post = await handleGetPost(postId)
            if(!$userInfo || $userInfo["id"] !== post.user.id) {
                return navigate("/")
            }
            title = post.title
            modifyContent = post.content
        }
    }

    const onTextChange = (event: any) => {
        content = event.detail.html
        console.log(content)
        imageFormatter(title, content)
    }

    const handleSubmit = async () => {
        let params = {
            title,
            content,
            boardName,
        }

        // const formatContent = await imageFormatter(title, content)
        // if (formatContent?.status == false) {
        //     return popup(formatContent.message, 0)
        // } else if (formatContent?.status == true){
        //     params["thumbnailURL"] = formatContent["thumbnail"]
        //     params["content"] = formatContent["html"]
        // }

        console.log(params)

        // const response = await got({
        //     urlParams: "/post/create",
        //     method: "POST",
        //     setParams: params
        // })

        // if (response.statusCode == 1){
        //     await getUserInfo()
        //     navigate(`/${$writeBoard}?board=${boardName}&post=${response.data.postId}`)
        // } else {
        //     popup(response.message, response.statusCode)
        // }
    }

    const handleUpdateSubmit = async () => {

        let params = {
            postId,
            title,
            content,
        }

        const formatContent = await imageFormatter(title, content)
        if (formatContent?.status == false) {
            return popup(formatContent.message, 0)
        } else if (formatContent?.status == true){
            params["thumbnailURL"] = formatContent["thumbnail"]
            params["content"] = formatContent["html"]
        }

        const response = await got({
            urlParams: "/post",
            method: "PATCH",
            setParams: params
        })
        if (response.statusCode !== 1){
            popup(response.message, response.statusCode)
        } else {
            history.go(-1)
        }
    }

    init()

</script>

<form class="content edit" on:submit|preventDefault={()=>{
    postId ? handleUpdateSubmit() : handleSubmit()
}}>
    <div class="edit__title">
        <input 
            bind:value={title}
            type="text" 
            class="edit__title__input"
            required
            placeholder="제목을 입력해 주세요."
        >
    </div>
    <Editor {onTextChange} data={modifyContent} />
    <div class="edit__form">
        <button 
            type="button"
            class="black line medium"
            on:click={()=>{
                history.go(-1)
            }}
        >뒤로가기</button>
        <button 
            type="submit"
            class="medium"
        >
            {postId ? "수정하기" : "등록하기"}
        </button>
    </div>
</form>

<style lang="scss">
    @use "./BoardWriter.scss";
</style>