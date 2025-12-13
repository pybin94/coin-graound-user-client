<script lang="ts">
    import ViewForm from "components/Board/ViewForm.svelte";
    import BoardList from "components/Board/BoardList.svelte";
    import { boardTitle, type Post } from "constants/board";
    import { currentUrl, userInfo, postParams, writeBoard } from "stores/store";
    // import { navigate } from "svelte-routing/src/history";
    import Pagenation from "utils/Pagenation.svelte";
    import SearchForm from "utils/SearchForm.svelte";
    import Table from "utils/Table.svelte";
    import { link } from "svelte-routing";
    import { got, urlParams } from "utils/helpers";
    import { popup } from "utils/popup";
    import CommentForm from "components/Board/CommentForm.svelte";
    import FormTitle from "components/Board/FormTitle.svelte";
    import { onMount } from "svelte";
    import { handleGetPost, updateViewCount } from "services/board";
    import MenuHeader from "components/Layout/MenuHeader/MenuHeader.svelte";
    import { type MenuHeaderModel } from "models/layout";

    const menuHeader: MenuHeaderModel = {
        icon: "fa-solid fa-headphones",
        title: "그라운드",
        subTitle: "고수들의 투자 인사이트",
    }
    
    let currentPage: number = 1;
    let limit: number = 20;
    let offset: number = limit * currentPage-1;
    let searchType: number;
    let searchValue: string;
    let tableList: Array<object>;
    let fullPage: number = 1;
    let boardName: string;
    let post: Post;
    let path: string;

    const searchForm: [number, number, string] = [limit, searchType, searchValue];

    const init = async () => {
        currentUrl.set(window.location.pathname + window.location.search)
        path = (window.location.pathname).replace("/", "");

        boardName = urlParams("board")
        postParams.set(urlParams("post"))
        post = null
        
        if($postParams) {
            post = await handleGetPost(Number($postParams))
        }

        handleGetList()
    }

    const handleSetPost = async (id: number) => {
        post = null
        await updateViewCount(id)
        post = await handleGetPost(id)
    }

    const handleGetList = async (setPage?: number) => {
        if(setPage) currentPage = setPage;

        limit = searchForm[0]
        offset = limit * (currentPage-1);

        let params = {
            limit,
            offset,
            boardName,
        }

        if(searchForm[2]) {
            params["searchValue"] = searchForm[2];
        }

        const response = await got({
            urlParams: "/post/list",
            method: "POST",
            setParams: params
        })
        if(response.statusCode == 1){
            tableList = response.data.list
                      
            if(response.data.total !== 0) {
                fullPage = Math.ceil(response.data.total / limit);
            };
        } else if(response.status == 0){
            popup(response.message, response.statusCode)
        }
    }

    const handleBack = () => {
        init()
    }

    onMount(()=>{
        window.addEventListener('popstate', handleBack);
        return ()=>{
            window.removeEventListener('popstate', handleBack);
        }
    })
    init()
</script>

<div class="content board">
    {#if post} 
    <article class="board__form box">
        <FormTitle {post} />
        <ViewForm {post} />
        {#if $userInfo && $userInfo["id"] == post.user.id}
            <div class="board__form__modify">
                <button>
                    <a use:link href="/write/board/?post={post.id}">수정</a>
                </button>
            </div>
        {/if}
        <CommentForm {post} />
    </article>
    {/if}
    <div class="box">
        <MenuHeader {menuHeader} />
        <SearchForm {handleGetList} {searchForm} />
        <Table tableTitle={boardTitle} {tableList} >
            <BoardList {tableList} {handleSetPost} {boardName}/>
        </Table>
        <Pagenation {handleGetList} {fullPage} {currentPage} />
    </div>
    {#if $userInfo}
        <div class="board__write-button">
            <!-- <button 
                class="black medium"
                on:click={()=>{
                    writeBoard.set(path)
                    navigate(`/write?board=${boardName}`)}
                }
            >
                글쓰기
            </button> -->
        </div>
    {/if}
</div>

<style lang="scss">
    @use "./Board.scss";
</style>