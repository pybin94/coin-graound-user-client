export interface Chat {
    joinCount: number;
    chatHistory: Array<ChatHistory>
}

export interface ChatHistory {
    id: number;
    nickname: string;
    picture: string;
    chat: string;
}