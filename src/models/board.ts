import { type UserModel } from "constants/user";
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