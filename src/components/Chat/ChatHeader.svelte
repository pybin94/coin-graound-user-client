<script lang="ts">
    import type { Chat } from 'models/Chat';

    export let chatLog: Chat

    const openChatFullScreen = () => {

        if (window.location.pathname == "/chat") {
            window.close();
        } else {    
            const options = "toolbar=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1200, height=800, top=0,left=0";
            window.open("/chat", "_blank", options)
        }
    }
</script>

<div class="chat-header">
    {#if chatLog}
        <p class="chat-header__live">현재 접속자 {chatLog.joinCount}</p>
        <i on:click={openChatFullScreen} class="chat-header__full-screen fa-solid fa-up-down-left-right"></i>
    {/if}
</div>

<style lang="scss">
    @use "./ChatHeader.scss";
</style>