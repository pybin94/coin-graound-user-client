import { writable } from "svelte/store";

// 이전 페이지 URL 저장
export const prevUrl = writable(null);

// pushState 오버라이드
const originalPushState = history.pushState;
history.pushState = function (...args) {
    prevUrl.set(window.location.href); // 변경 전 URL 저장
    originalPushState.apply(history, args);
};

// replaceState 오버라이드
const originalReplaceState = history.replaceState;
history.replaceState = function (...args) {
    prevUrl.set(window.location.href); // 변경 전 URL 저장
    originalReplaceState.apply(history, args);
};

// popstate(뒤로가기/앞으로가기)
window.addEventListener("popstate", () => {
    prevUrl.set(document.referrer || null); // 뒤로가기는 referrer가 더 정확
});
