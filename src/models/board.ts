import { type UserModel } from "models/user";
import { type CoinModel } from "./chart";

export interface FeedModel {
    id: number,
    user: UserModel,
    coin: CoinModel,
    content: string,
    price: string,
    createdAt: string,
    updatedAt: string,
    likeCount: number,
    dislikeCount: number,
}

export interface PostModel {
    id: number;
    user: UserModel;
    title: string;
    content: string;
    comment?: Comment[];
    createdAt: string;
    updatedAt: string;
    blockedAt: string;
    viewCount: number;
    likeCount: number;
    dislikeCount: number;
    postMeta?: PostMetaModel[];
}

export interface PostMetaModel {
    id: number;
    value: string;
    priority: number;
    type: string;
}

export interface CommentModel {
    id: number;
    user: UserModel;
    post: PostModel;
    children?: Comment[];
    content: string;
    createdAt: string;
    updatedAt: string;
    blockedAt: string;
    likeCount: number;
    dislikeCount: number;
}
