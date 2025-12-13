<script lang="ts">
    import MenuHeader from "components/Layout/MenuHeader/MenuHeader.svelte";
    import { type MenuHeaderModel } from "models/layout";

    const menuHeader: MenuHeaderModel = {
        icon: "fa-solid fa-coins",
        title: "프로모션",
        subTitle: "레퍼럴 및 추천인 이벤트",
    }
    
</script>

<main class="promotion content">
    <MenuHeader {menuHeader} />
</main>

<style lang="scss">
    @use "./Promotion.scss";
</style>