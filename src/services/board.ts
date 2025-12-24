import type { PostModel } from "models/board"
import { got, urlParams } from "utils/helpers"

export const handleGetPost = async (postId: number): Promise<PostModel> => {

    let params = {
        postId
    }

    const response = await got({
        urlParams: "/post",
        method: "POST",
        setParams: params
    })
    if (response.statusCode == 1) {
        window.scrollTo({ top: 0 });
        return response.data
    }
}

export const updateViewCount = async (postId: number): Promise<void> => {
    let params = {
        postId
    }
    await got({
        urlParams: "/post/view-count",
        method: "PATCH",
        setParams: params
    })
}

export const uploadImage = async (image: string): Promise<string> => {
    let params = {
        image
    }
    const response = await got({
        urlParams: "/post/image",
        method: "POST",
        setParams: params
    })

    if (response.statusCode == 1) {
        return response.data.filePath
    }
}