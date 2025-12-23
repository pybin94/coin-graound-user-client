export interface ChatModel {
    joinCount: number;
    chatHistory: Array<ChatHistoryModel>
}

export interface ChatHistoryModel {
    id: number;
    nickname: string;
    picture: string;
    chat: string;
}