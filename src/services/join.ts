import { userInfo } from "stores/store"
import { navigate } from "svelte-routing"
import { getCookie, got } from "utils/helpers"

export const handleJoinout = async () => {
    const response = await got(
        {
            urlParams: "/joinout"
        }
    )
    if(response.ststue == 1) {
        navigate("/", {replace: true})
        userInfo.set(getCookie("userInfo") && JSON.parse(getCookie("userInfo")))
    };
}