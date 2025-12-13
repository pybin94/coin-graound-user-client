<script lang="ts">
    import { type MenuHeaderModel } from "models/layout";

    export let menuHeader: MenuHeaderModel;
</script>

<div class="menu-header">
    <div class="menu-header__left">
        <div class="menu-header__left__icon">
            <i class="{menuHeader.icon}"></i>
        </div>
        <div class="menu-header__left__title">
            <h1>{menuHeader.title}</h1>
            <p>{menuHeader.subTitle}</p>
        </div>
    </div>
    {#if menuHeader.extraHTML}
    <div class="menu-header__right">
        {@html menuHeader.extraHTML}
        
    </div>
    {/if}
</div>

<style lang="scss">
    @use "./MenuHeader.scss";
</style>