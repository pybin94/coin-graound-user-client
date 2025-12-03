<script lang="ts">
    import { userInfo } from "stores/store";

    export let sendMessage: Function;
    export let handleChatMessageChange: Function;

    let inputValue: string;

</script>

<form class="chat" on:submit|preventDefault={()=>{
    inputValue = ""
    sendMessage()
}}>
    <div class="chat-footer">
        <input 
            type="text" 
            class="chat-footer__input"
            bind:value={inputValue}
            on:keyup={()=>{handleChatMessageChange(inputValue)}}
            placeholder="{$userInfo ? "메세지를 입력해주세요." : "로그인이 필요합니다."}" 
            disabled={$userInfo ? false : true}
        >
        <button class="chat-footer__send">
            <i class="fa-solid fa-arrow-up chat-footer__send__icon"></i>
        </button>
    </div>
</form>

<style lang="scss">
    @use "./ChatFooter.scss";
</style>