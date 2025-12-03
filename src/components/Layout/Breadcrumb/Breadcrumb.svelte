<script lang="ts">
    import { currentSubtitle, currentTitle, currentUrl } from "stores/store";
    import { link } from "svelte-routing";
</script>

{#if $currentUrl !== "/"}
    <div class="breadcrumb">
        <h2 class="breadcrumb__title">{$currentTitle}</h2>
    </div>
{/if}

<style lang="scss">
    @use "./Breadcrumb.scss";
</style>