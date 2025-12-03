<script lang="ts">
    import { link } from "svelte-routing";
</script>

<div class="not-found no-layout content">
    <h2 class="not-found__title">페이지가 없어요 :(</h2>
    <p class="not-found__description">주소가 잘못되었거나 바뀐 것 같습니다.</p>
    <a use:link href="/" class="not-found__logo">
        <img src="/src/assets/logo.png" alt="사이트 로고">
    </a>
    <div class="not-found__goto">
        <button 
            class="not-found__goto__button back"
            on:click={()=>{
                history.go(-1)
            }}
        >
            <p class="not-found__goto__button__name back">뒤로 가기</p>
        </button>
        <button class="not-found__goto__button">
            <a class="not-found__goto__button__name" use:link href="/">첫화면 가기</a>
        </button>
    </div>
</div>

<style lang="scss">
    @use "./Notfound.scss";
</style>