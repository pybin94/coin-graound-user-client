import type { User } from "./user";

export interface Post {
    id: number;
    user: User;
    title: string;
    content: string;
    comment?: Comment[];
    createdAt: string;
    updatedAt: string;
    blockedAt: string;
    viewCount: number;
    likeCount: number;
    dislikeCount: number;
    postMeta?: PostMeta[];
}

export interface PostMeta {
    id: number;
    value: string;
    priority: number;
    type: string;
}

export interface Comment {
    id: number;
    user: User;
    post: Post;
    children?: Comment[];
    content: string;
    createdAt: string;
    updatedAt: string;
    blockedAt: string;
    likeCount: number;
    dislikeCount: number;
}

export const boardTitle = [
    "번호",
    "제목",
    "글쓴이",
    "작성일",
    "조회",
    "추천",
];
