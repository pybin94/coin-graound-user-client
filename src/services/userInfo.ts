import { myPoint } from "stores/user.store";
import { got } from "utils/helpers";

interface UserInfo {
    id?: number, 
    searchType?: number, 
    searchValue?: string,
}

export const getUserInfo = async (): Promise<any> => {
    const response = await got({
        urlParams: "/user",
    });
    if(response.statusCode == 1) {
        return response.data;
    };
};
