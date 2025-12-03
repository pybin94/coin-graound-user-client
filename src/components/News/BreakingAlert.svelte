<script lang="ts">
    export let breakingAlertCheck: boolean;
    export let handleScrollTop: any;
</script>

{#if breakingAlertCheck == true}
<button 
    class="unset breaking-alert"
    on:click={handleScrollTop}
>
    <div class="breaking-alert__icon">
        <svg class="header__left__icon__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>
    </div>
    <span class="breaking-alert__text">신규 속보</span>
</button>
{/if}


<style lang="scss">
    @use "./BreakingAlert.scss";
</style>