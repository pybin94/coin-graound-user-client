<script lang="ts">
    import Percentage from "./Calculate/Percentage.svelte";
    import Return from "./Calculate/Return.svelte";
    import BuyTheDip from "./Calculate/BuyTheDip.svelte";
</script>

<section class="calculate-group">
    <div class="calculate-group__left">
        <Percentage />
        <Return />
    </div>
    <div class="calculate-group__right">
        <BuyTheDip />
    </div>
</section>

<style lang="scss">
    @use "./Calculate.scss";
</style>