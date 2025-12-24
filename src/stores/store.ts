import { OrderTypeModel } from 'models/helpers';
import { writable } from 'svelte/store';
import { getCookie } from 'utils/helpers';
import { type UserModel } from 'models/user';

export const currentUrl = writable("/");
export const currentTitle = writable("");
export const currentSubtitle = writable("");

export const userInfo = writable((getCookie("userInfo") && JSON.parse(getCookie("userInfo")!) as UserModel) || null)
export const gamePopup = writable();
export const writeBoard = writable("");

export const nightMode = writable(getCookie("nightMode") ? getCookie("nightMode") : "off");

export const chartSort = writable(false);
export const chartSortTarget = writable("atp24h");
export const chartSortOrder = writable(OrderTypeModel.DESC);

export const usDollerPrice = writable(0);

export const currentIndex = writable(-1)