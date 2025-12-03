<!-- <script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import io from 'socket.io-client';
    import { userInfo } from 'stores/store';
    import { popup } from 'utils/popup';
    import { getCookie, setCookie } from 'utils/helpers';
    import type { Chat } from 'models/Chat';
    import ChatHeader from 'components/Chat/ChatHeader.svelte';
    import ChatFooter from 'components/Chat/ChatFooter.svelte';
    import ChatBody from 'components/Chat/ChatBody.svelte';
 
    let socket: any;
    let chatWindow: HTMLUListElement;
    let chatLog: Chat;
    let chatMessage: string;

    onMount(() => {
        socket = io(process.env.SOCKET_URL);

        socket.on('chat', (message) => {
            chatLog = message;
        });
    });

    onDestroy(() => {
        socket.disconnect();
    });

    const handleChatMessageChange = (value: string) => {
        chatMessage = value
    }

    const sendMessage = () => {
        if(getCookie("chatSpamCooldown")) return popup(`도배글 작성시 채팅방 이용에 제한이 있을 수 있습니다.`, 0);
        if (!$userInfo) return;
        if (!chatMessage) return;
        setCookie("chatSpamCooldown", "-", 3)
        if (!chatMessage) return;

        socket.emit('chat', {
            chatInfo: getCookie("chatInfo"),
            chat: chatMessage,
        });
        chatMessage = ""
    }
</script>
<section class="chat {window.location.pathname == "/chat" ? "no-layout" : "card"}">
    <ChatHeader {chatLog}/>
    {#if chatLog}
    <ChatBody {chatLog} {chatWindow} />
    {/if}
    <ChatFooter {sendMessage} {handleChatMessageChange}/>
</section>


<style lang="scss">
    @use "./Chat.scss";
</style> -->