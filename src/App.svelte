<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import Layout from "pages/Layout/Layout.svelte";
    import Dashboard from "pages/Dashboard/Dashboard.svelte";
    import Test from "pages/Test.svelte";
    import Join from "pages/Join/Join.svelte";
    import NotFound from "pages/NotFound/NotFound.svelte";
    import { nightMode } from "stores/store";
    import Board from "pages/Board/Board.svelte";
    import BoardWriter from "pages/Board/BoardWriter.svelte";
    import Reload from "pages/Reload.svelte";
    import None from "pages/None.svelte";
    import Profile from "components/Mypage/Profile/Profile.svelte";
    import Chart from "pages/Chart/Chart.svelte";
    import News from "pages/News/News.svelte";
    import Posts from "components/Mypage/Posts/Posts.svelte";
    import Feed from "components/Mypage/Feed/Feed.svelte";
    import Promotion from "pages/Promotion/Promotion.svelte";
    import { prevUrl } from "stores/url.store";

    const init = () => {
        document.title = process.env.SITENAME;
    };

    $: if ($nightMode == "on") {
        document.body.classList.remove("light");
    } else {
        document.body.classList.add("light");
    }

    $: console.log($prevUrl);

    init();
</script>

<Router basepath="/">
    <Route path="/joinin"><Join /></Route>
    <Route path="/*"><NotFound /></Route>
    <Layout>
        <Route {prevUrl} path="/"><Dashboard /></Route>
        <Route {prevUrl} path="/board/*"><Board boardId="ground" /></Route>
        <Route {prevUrl} path="/promotion"><Promotion /></Route>
        <Route {prevUrl} path="/chart"><Chart /></Route>
        <Route {prevUrl} path="/news"><News /></Route>
        <Route {prevUrl} path="/write/*"><BoardWriter /></Route>
        <Route {prevUrl} path="/chat"><None /></Route>
        <Route {prevUrl} path="/mypage/profile"><Profile /></Route>
        <Route {prevUrl} path="/mypage/feeds"><Feed /></Route>
        <Route {prevUrl} path="/mypage/posts"><Posts /></Route>
        <Route {prevUrl} path="/reload"><Reload /></Route>
        <Route {prevUrl} path="/test"><Test /></Route>
    </Layout>
</Router>

<style lang="scss">
    @use "./App.scss";
    @use "./styles/popup.scss";
</style>
