<script lang="ts">
    import type { Chat, ChatHistory } from "models/Chat";
    import { onMount } from "svelte";
    import { popup } from "utils/popup";

    export let chatLog: Chat;
    export let chatWindow: HTMLUListElement;

    let toBottomButton: HTMLButtonElement;

    onMount(()=>{
        chatWindow.scrollTo(0, 99999)
    })

    const chatWindowScroll = () => {
        if(chatLog) {
            setTimeout(()=>{
                if (chatWindow.scrollHeight <= chatWindow.scrollTop +  chatWindow.offsetHeight + 100) {
                    chatWindow.scrollTo(0, 99999)
                }
            })
        };
    }

    const showToBottomButton = () => {
        if (chatWindow.scrollHeight > chatWindow.scrollTop +  chatWindow.offsetHeight + 100) {
            toBottomButton.style.display = "block"
        } else {
            toBottomButton.style.display = "none"
        }
    }

    const showMoreModal = (e: any) => {
        let selectElement = e.target;

        if (e.target.classList.contains("more-button") == false) {
            selectElement = e.target.parentNode
        };

        selectElement.lastChild.classList.add("more-active");
    }

    const sendDeclaration = (chat: ChatHistory) => {
        let chatLog = chat.chat
        popup(`내용<br>${chatLog} <br><br>해당 글을 신고하시겠습니까?`, 3, (data: boolean)=>{
            if (data == false) return;
            popup("신고가 접수되었습니다.", 1)
        })
    }

    const hideMoreModal = () => {
        document.querySelectorAll(".more-active").forEach((element)=>{
            element.classList.remove("more-active")
        })
    }

    $: chatLog, chatWindowScroll();
</script>

<div class="chat-body" class:full-screen={window.location.pathname == "/chat"}>
    <div class="chat-body__gradient">
        <ul 
            class="chat-body__content"
            bind:this={chatWindow}
            on:scroll={showToBottomButton}
        >
            {#each chatLog.chatHistory as chat}
                <li 
                    class="chat-body__content__list"
                    on:mouseleave={hideMoreModal}
                >
                    <img 
                        class="chat-body__content__list__thumb {chat.picture ? "" : "none"}" 
                        src="{chat.picture ? chat.picture : "/src/assets/uploads/profile/none.png"}" 
                        alt="프로필 이미지"
                    >
                    <p class="chat-body__content__list__nickname">{chat.nickname}</p>
                    <p class="chat-body__content__list__chat-message">{chat.chat}</p>
                    <div 
                        class="chat-body__content__list__more more-button"
                        on:click={(e)=>{showMoreModal(e)}}
                    >
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                        <div 
                            class="chat-body__content__list__more__box"
                            on:click={(e)=>{sendDeclaration(chat)}}
                        >
                            <p>신고</p>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
    <button 
        class="chat-body__to-bottom"
        bind:this={toBottomButton} 
        on:click={()=>{chatWindow.scrollTo(0, 99999)}}
    >
        <i class="fa-solid fa-circle-arrow-down"></i>
    </button>    
</div>
<style lang="scss">
    @use "./ChatBody.scss";
</style>