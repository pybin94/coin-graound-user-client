export interface CurrentMenu {
    title: string,
    subtitle: string,
    slot: any,
}

interface Menus {
    title: string;
    url: string;
    icon: string;
}

export const menus: Array<Menus> = [
    {
        title: "홈", 
        url: "/",
        icon: "fa-solid fa-house",
    },
    {
        title: "차트", 
        url: "/chart",
        icon: "fa-solid fa-chart-simple",
    }, 
    {
        title: "속보", 
        url: "/news",
        icon: "fa-solid fa-newspaper",
    }, 
    {
        title: "그라운드", 
        url: "/board",
        icon: "fa-solid fa-clapperboard",
    }, 
];
