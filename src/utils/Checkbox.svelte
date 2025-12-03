<script lang="ts">
    /** Usage
     *  status = 0: unchecked, 1: checked 
     *  type = 0: text, 1: iconfinder 
     */

    interface List {
        status: number;
        type: number;
        contents: string;
    }

    export let checkbox: Array<List>;
    
</script>

<div class="radio">
    <form>
        {#each checkbox as item}
            <label>
                {#if item.status === 0}
                    <input type="checkbox" name="">
                {:else}
                    <input type="checkbox" name="" checked>
                {/if}
                <div class="icon-box">
                    {#if item.type === 0}
                        {item.contents}
                    {:else if item.type === 1}
                        <i class="{item.contents}" aria-hidden="true"></i>
                    {/if}
                </div>
            </label>
        {/each}
    </form> 
</div>

<style lang="scss">
    .radio {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        border-radius: 10px;
        padding: 5px 15px;
        width: fit-content;
        background: #ebf5fc;
        box-shadow: -2px -2px 5px rgba(255, 255, 255, 1),
                    3px 3px 5px rgba(0, 0, 0, 0.1);
        
        & form {
            position: relative;
            text-align: center;
            display: flex;
            
            & label {
            position: relative; 
            cursor: pointer;
            margin: 15px;
            
                & input[type="checkbox"] {
                    display: none;

                }
                
                & :checked ~ .icon-box {
                    box-shadow: inset -2px -2px 5px rgba(255, 255, 255, 1),
                        inset 3px 3px 5px rgba(0, 0, 0, 0.1);
                        color: #6a9bd8;
                }
                
                & .icon-box {
                    padding: 13px;
                    background: #ebf5fc;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: -2px -2px 5px rgba(255, 255, 255, 1),
                        3px 3px 5px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    color: #666;
                    & .fa {
                    font-size: 18px;
                    }
                }
            }
        }
    }
</style>