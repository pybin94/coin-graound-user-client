<script lang="ts">
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { getPathname } from "utils/helpers";
    import Radio from "utils/Radio.svelte";

    let setIndex = 0
    const profinePath = "/mypage/profile"
    const feedPath = "/mypage/feeds"
    const postsPath = "/mypage/posts"

    let radioList = ["프로필", "피드", "게시글"];
    const handleRadioValue = (setIndex: number) => {
        if(setIndex == 0) {
            return navigate(profinePath)
        } else if (setIndex == 1) {
            return navigate(feedPath)
        } else if (setIndex == 2) {
            return navigate(postsPath)
        }
    }

    onMount(()=>{
        const pathName = window.location.pathname;

        if(pathName == profinePath) {
            setIndex = 0
        } else if (pathName == feedPath) {
            setIndex = 1
        } else if (pathName == postsPath) {
            setIndex = 2
        }
    })

</script>

<div class="mypage-sidebar">
    <Radio {radioList} {handleRadioValue} {setIndex}/>
</div>

<style lang="scss">
    @use "./MypageSidebar.scss";
</style>