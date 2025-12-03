import type { Post } from "constants/board"
import { postParams } from "stores/store"
import { got, urlParams } from "utils/helpers"

export const handleGetPost = async (postId: number): Promise<Post> => {

    let params = {
        postId
    }

    const response = await got({
        urlParams: "/post", 
        method: "POST", 
        setParams: params
    })
    if (response.statusCode == 1) {
        postParams.set(urlParams("post"))
        window.scrollTo({ top: 0  }); 
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