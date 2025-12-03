<script lang="ts">
    /** Usage
     * let radioList = ["Type A", "Type B"];
     * let radioValue = "A";
     * const handleRadioValue = (setIndex: number) => {
     *    if(setIndex == 0) {
     *        radioValue = "A"
     *    } else if (setIndex == 1) {
     *        radioValue = "B"
     *    } ...
     * }
     * 
     * <Radio {radioList} {handleRadioValue} />
     */ 
    
    export let radioList: Array<any>;
    export let handleRadioValue: any;
</script>

<div class="radio-inputs">
    {#each radioList as item, index}
        <label class="radio-inputs__radio">
            <input 
                type="radio" 
                name="radio" 
                checked={index == 0 ? true : false} 
                on:click={()=>{handleRadioValue(index)}}
            >
            <span class="radio-inputs__radio__name">{item}</span>
        </label>
    {/each}
</div>

<style lang="scss">
    @use "../styles/radio.scss";
</style>