<script lang="ts">
    export let title: string; 
    export let visible: boolean;
    export let handleVisible: Function;

    let animation: boolean;
    let showModal: boolean = false;
    let blockModal: boolean = false;

    const handleIntro = (): void => {
        animation = true;
        showModal = true;
        blockModal = false;
    };

    const handleOutro = (): void => {
        if(showModal == true && blockModal == false) {
            blockModal = true
            animation = false
            setTimeout(()=>{
                showModal = false
                handleVisible();
            }, 300);
        }
    };

    const handleShowModalOutro = (): void => {
        if(showModal == true) {
            animation = false
            setTimeout(()=>{
                showModal = false
            }, 300);
        }
    };

    $: if(visible === true){
        handleIntro()
    } else if (visible === false) {
        handleShowModalOutro()
    }
</script>

{#if showModal}
    <div class="modal">
        <div
            class="modal__cover" class:inactive={animation === false}
            on:click={handleOutro}
            on:keypress={handleOutro}
        ></div>
        <div 
            class="modal__contents" class:inactive={animation === false}
        >   
            <div class="modal__contents__header">{title}
                <i class="fa-solid fa-xmark modal__contents__header__close"
                    on:click={handleOutro}
                    on:keypress={handleOutro}
                ></i>
            </div>
            <div class="modal__contents__content">
                <slot />
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    @use "../styles/animation.scss";
    @use "../styles/modal.scss";
</style>
