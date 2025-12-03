import { OrderType } from 'models/helpers';
import { writable } from 'svelte/store';
import { getCookie } from 'utils/helpers';

export const currentUrl = writable("/");
export const currentTitle = writable("");
export const currentSubtitle = writable("");
export const postParams = writable();

export const userInfo = writable(getCookie("userInfo"))
export const gamePopup = writable();
export const writeBoard = writable("");

export const nightMode = writable(getCookie("nightMode") ? getCookie("nightMode") : "off");

export const chartSort = writable(false);
export const chartSortTarget = writable("atp24h");
export const chartSortOrder = writable(OrderType.DESC);

export const usDollerPrice = writable(0);

export const currentIndex = writable(0)