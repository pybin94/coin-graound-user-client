<script lang="ts">
    import MypageSideBar from "components/Mypage/MypageSideBar.svelte";
    import { onMount } from "svelte";
</script>

<div class="mypage content">
    <div class="mypage__wrap">
        <MypageSideBar />
        <div class="mypage__slot card">
            <slot />
        </div>
    </div>
</div>

<style lang="scss">
    @use "./MyPage.scss";
</style>