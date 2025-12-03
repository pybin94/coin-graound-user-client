<script lang="ts">

    import { link, navigate } from "svelte-routing";
    import Radio from "utils/Radio.svelte";

    let radioList = ["프로필", "게시글"];
    const handleRadioValue = (setIndex: number) => {
        if(setIndex == 0) {
            navigate(`/mypage`)
        } else if (setIndex == 1) {
            navigate(`/point`)
        }
    }

</script>

<div class="mypage-sidebar">
    <Radio {radioList} {handleRadioValue} />
</div>

<style lang="scss">
    @use "./MypageSidebar.scss";
</style>