<script lang="ts">
    import MypageSideBar from "components/Mypage/MypageSideBar.svelte";
    import { handleJoinout } from "services/join";
</script>

<div class="mypage content">
    <div class="mypage__wrap">
        <MypageSideBar />
        <div class="mypage__slot card">
            <slot />
        </div>

        <button
            class="mypage__joinout unset"
            role="button"
            tabindex="0"
            on:click={handleJoinout}
            on:keypress={handleJoinout}
        >
            로그아웃
        </button>
    </div>
</div>

<style lang="scss">
    @use "./MyPage.scss";
</style>