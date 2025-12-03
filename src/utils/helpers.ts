import type { GotParams, SortObjectData } from 'models/helpers';
import { userInfo } from "stores/store";
import { navigate } from "svelte-routing";

export const url = (params: string, EXTRA_URL: boolean = false): string => {
    if (EXTRA_URL) {
        return process.env.DATA_PIPELINE_URL + params
    } else {
        return process.env.URL + params
    }
}

export const got = async ({
    urlParams = "", 
    method = "GET", 
    setParams, 
    EXTRA_URL = false
}: GotParams ): Promise<any> => {

    let api: string = url(urlParams, EXTRA_URL)
    let options: object = {
        method: method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
    };

    if (setParams) options["body"] = JSON.stringify(setParams);
    
    try {
        const response = await fetch(api, options);
        const res = await response.json();
        
        if(res.status == -1) {  
            navigate("/");  
            return false;
        } else if (res.status === -2, res.error == -2) {
            deleteCookie("userInfo")
            userInfo.set(null)
            return false;
        } else {
            return res;
        }
    } catch (error) {
        console.log(error);
        return {status: 0, message: "오류가 발생했습니다."};
    };
};

export const getCookie = (cookieName: string): string => {
    let name: string;
    let data: string;
    let cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        name = cookies[i].substring(0, cookies[i].indexOf('='));
        data = cookies[i].substring(cookies[i].indexOf('=') + 1);
        name = name.replace(/^\s+|\s+$/g, '');
        if (name == cookieName) {
            return decodeURIComponent(data);
        }
    }
}

export const setCookie = (cookieName: string, value: any, expires: number = 0): void => {

    var date = new Date();
    date.setTime(date.getTime() + expires*1000);

    expires == 0
    ? document.cookie = cookieName + '=' + encodeURIComponent(value) + ';path=/'
    : document.cookie = cookieName + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString() + ';path=/';
}

export const deleteCookie = (cookieName: string): void => {
	document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

export const getLs = (key: string) => {
    const getData = localStorage.getItem(key);

    if (!getData) return null;
    const parsedData = JSON.parse(getData);

    if (parsedData.expiry && new Date().getTime() > parsedData.expiry) {
        localStorage.removeItem(key);
        return null;
    }

    const decodedValue = atob(parsedData.value); 
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array([...decodedValue].map(char => char.charCodeAt(0))));
}

export const setLs = (key: string, value: any, expires: number = 0) => {
    const strValue = typeof value === "string" ? value : JSON.stringify(value);
    const base64Data = btoa(unescape(encodeURIComponent(strValue)));

    const item: any = { value: base64Data };

    if (expires !== 0) {
        const now = new Date().getTime();
        item.expiry = now + expires * 1000;
    }

    localStorage.setItem(key, JSON.stringify(item));
};

export const moneyFormat = (money: number | string) => {
    if(!money) return "0";
    
    let setMoney: number;
    let removeDecimal: number;

    if(typeof money === 'string'){
        setMoney = parseInt(money)
    } else if (typeof money === 'number'){
        setMoney = money
    }

    const format = setMoney.toLocaleString('ko-KR', {
        maximumFractionDigits: 2
    });
    // removeDecimal = Math.floor(setMoney)
    // const format = removeDecimal.toLocaleString('ko-KR');
    return format;
}

export const formatDollar = (num: number): string => {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(2) + 'B';
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(2) + 'M';
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(2) + 'K';
    } else {
        return num.toFixed(2);
    }
}

export const bigMoneyFormat = (money: number | string) => {
    if(!money) return "0";
    
    let setMoney: number;
    let removeDecimal: number;

    if(typeof money === 'string'){
        setMoney = parseInt(money)
    } else if (typeof money === 'number'){
        setMoney = money
    }

    removeDecimal = Math.floor(setMoney)
    
    if (removeDecimal >= 1000000) {
        return (Math.floor(removeDecimal/1000000 * 100) / 100).toLocaleString('ko-KR') + "M";
    }

    const format = removeDecimal.toLocaleString('ko-KR');
    return format;
}

export const dateFormat = (dateString: string | Date) => {
    const setDate = new Date(dateString);

    const year = setDate.getFullYear();
    const month = setDate.getMonth() + 1;
    const date = setDate.getDate();
    const hours = setDate.getHours();
    const minutes = setDate.getMinutes();
    const seconds = setDate.getSeconds();

    const localDateString = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return localDateString;
}

export const dateFormatShort = (dateString: string | Date) => {
    if(!dateString) return "0000-00-00"
    const setDate = new Date(dateString);

    const year = setDate.getFullYear();
    const month = setDate.getMonth() + 1;
    const date = setDate.getDate();

    const localDateString = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return localDateString;
}

export const dateFromatSimple = (dateString: string | Date) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    return `${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
}

export const boardDateFormat = (dateString: string | Date) => {
    const nowData = new Date()
    const setDate = new Date(dateString);

    const nowYear = nowData.getFullYear();
    const setYear = setDate.getFullYear();
    const nowMonth = nowData.getMonth() + 1;
    const setMonth = setDate.getMonth() + 1;
    const nowDay = nowData.getDate();
    const setDay = setDate.getDate();
    const nowHours = nowData.getHours();
    const setHours = setDate.getHours();
    const nowMinutes = nowData.getMinutes();
    const setMinutes = setDate.getMinutes();
    const nowSeconds = nowData.getSeconds();
    const setSeconds = setDate.getSeconds();

    const nowLocalDateString = `${nowYear}-${String(nowMonth).padStart(2, '0')}-${String(nowDay).padStart(2, '0')}`;
    const setLocalDateString = `${nowYear}-${String(setMonth).padStart(2, '0')}-${String(setDay).padStart(2, '0')}`;

    if(setLocalDateString == nowLocalDateString){
        return `${String(setHours).padStart(2, '0')}:${String(setMinutes).padStart(2, '0')}`;
    } else {
        return `${String(setMonth).padStart(2, '0')}.${String(setDay).padStart(2, '0')}`;
    }
}

export const now = () => {
    const nowDate = new Date
    const setTimeZone = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)) // Asia/Seoul
    return setTimeZone.toISOString().slice(0, 19).replace('T', ' ');
}

export const nowMin = (setWeek: number = 30) => {
    let nowDate = new Date();
    let weekAgo = new Date(nowDate.getTime() - setWeek * 24 * 60 * 60 * 1000);
    weekAgo.setHours(0, 0, 0, 0);
    return weekAgo;
}

export const nowMax = () => {
    let now = new Date();
    now.setHours(23, 59, 59, 0);
    return now;
}

export const nowDate = () => {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1;
    const day = nowDate.getDate();
    return `${year}-${month}-${day}`
}

export const dayCalculator = (date: string, setDay: number) => {
    const dateTime = new Date(date).getTime();
    const fixTime = dateTime + setDay*86400000
    const nowDate = new Date(fixTime)
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1;
    const day = nowDate.getDate();
    return `${year}-${month}-${day}`
}

export const calculateAge = (birthDate: Date) => {
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    let monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const wait = (timeToDelay: number) => new Promise((resolve) => setTimeout(resolve, timeToDelay))

export const reload = (url: string) => {
    getPathname(url);
    if(window.location.pathname == getPathname(url)) {
        navigate("/reload", { replace: false })
    }
}

export const sortObjectData = ({ data, target, order }: SortObjectData) => {
    if (!data || typeof data !== "object") return {};

    const multiplier = order === "desc" ? -1 : 1;

    return Object.fromEntries(
        Object.entries(data).sort(([, a], [, b]) => (a[target] - b[target]) * multiplier)
    );
};

export const getPathname = (url: string) => {
    return (new URL(url, window.location.origin)).pathname;
}

export const urlParams = (paramData: string) => {
    return new URLSearchParams(location.search).get(paramData)
}

export const setParams = (paramName: string, data: string) => {
    const url = new URL(String(window.location));
    url.searchParams.set(paramName, data);
    window.history.pushState({}, '', url);
}

export const timeAgo = (inputDate: string) => {
    const now = new Date();
    const past = new Date(inputDate);
    const diff = now.getTime() - past.getTime();

    const units = [
        { label: '년', millis: 1000 * 60 * 60 * 24 * 365 },
        { label: '개월', millis: 1000 * 60 * 60 * 24 * 30 },
        { label: '주', millis: 1000 * 60 * 60 * 24 * 7 },
        { label: '일', millis: 1000 * 60 * 60 * 24 },
        { label: '시간', millis: 1000 * 60 * 60 },
        { label: '분', millis: 1000 * 60 },
    ];

    for (const unit of units) {
        const elapsed = Math.floor(diff / unit.millis);
        if (elapsed >= 1) return `${elapsed}${unit.label} 전`;
    }

    return '방금 전';
}

export const convertToKSTTimeOnly = (isoDateStr: string): string => {
    const date = new Date(isoDateStr);
  
    // UTC 시간 기준으로 date 객체를 만든 후 한국 시간 (UTC+9) 보정
    const kstOffset = 9 * 60; // 분 단위
    const localTime = new Date(date.getTime() + kstOffset * 60 * 1000);
  
    // 시간, 분, 초 추출 및 포맷
    const hours = localTime.getUTCHours().toString().padStart(2, '0');
    const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = localTime.getUTCSeconds().toString().padStart(2, '0');
  
    // return `${hours}:${minutes}:${seconds}`;
    return `${hours}:${minutes}`;
}
  