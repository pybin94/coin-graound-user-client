<script lang="ts">
    /** Usage
     * let toggle: boolean = false;
     * const handleToggle = (): void => {
     *     toggle = !toggle
     * }
     * <Toggle toggle={toggle} handleToggle={handleToggle}/>
     */

    export let toggle: boolean | any;
    export let handleToggle: any;
</script>

<div 
    class="slider-toggle" class:active={toggle === true}
    on:click={handleToggle}
    on:keypress={handleToggle}
>
    <div class="slider-toggle__button"></div>
</div>

<style lang="scss">
   @use "../styles/toggle.scss";
</style>