import { type UserModel } from "constants/user";

export interface FeedModel {
    id: number,
    user: UserModel,
    content: string,
    price: string,
    createdAt: string,
    updatedAt: string,
    likeCount: number,
    dislikeCount: number,
}