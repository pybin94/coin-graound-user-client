/** Usage
 * status 0: 실패
 * status 1: 성공
 * status 2: 경고
 * status 3: 확인
 * 
 * status 0 or 1
 * popup("description", status);
 * 
 * status 2 or 3
 * popup("description", status, (data) => {
 *    if (data == false) return;
 *    ... callback 
 * });
 */

interface PopupOptions {
    icon: string;
    title: string;
    color: string;
}

interface PopupInstance {
    id: string;
    element: HTMLElement;
    cover: HTMLElement | null;
    status: number;
    callback?: any;
    timer?: NodeJS.Timeout;
    isHovered?: boolean;
}

const options: Array<PopupOptions> = [
    {icon: "xmark", title: "실패", color: "fail"},
    {icon: "check", title: "성공", color: "success"},
    {icon: "question", title: "확인", color: "confirm"},
    {icon: "exclamation", title: "경고", color: "danger"},
]

// 팝업 인스턴스들을 관리하는 배열
let popupInstances: PopupInstance[] = [];

export const popup = async (description: string = "", status: number = 1, callback?: any): Promise<void>  => {
    const popupId = `popup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    let popupElement: HTMLElement = document.createElement('div');
    const isToast = status === 0 || status === 1;
    const isConfirm = status === 2 || status === 3;
    
    // 모든 팝업에 toast 스타일 적용
    let className = `popup slide-up toast`;
    if (isConfirm) {
        className += ' confirm';
    }
    
    popupElement.setAttribute("class", className);
    popupElement.setAttribute("data-popup-id", popupId);
    document.querySelector("#app").appendChild(popupElement)

    let coverElement: HTMLElement | null = null;
    
    // status 0, 1이 아닌 경우에만 cover 생성
    if (!isToast) {
        coverElement = document.createElement('div');
        coverElement.setAttribute("class", "popup-cover fade");
        coverElement.setAttribute("data-popup-id", popupId);
        document.querySelector("#app").appendChild(coverElement);
    }
    
    popupElement.innerHTML = popupContent(description, status);
    
    // 애니메이션 시작 - 약간의 지연을 두어 slide-up 효과가 보이도록 함
    setTimeout(() => {
        popupElement.classList.remove("slide-up")
        if (coverElement) {
            coverElement.classList.remove("fade")
        }
    }, 10)

    // 팝업 인스턴스 저장
    const popupInstance: PopupInstance = {
        id: popupId,
        element: popupElement,
        cover: coverElement,
        status: status || 1,
        callback,
        isHovered: false
    };
    
    popupInstances.push(popupInstance);
    
    // z-index 조정 (새로운 팝업이 위에 오도록)
    updatePopupZIndex();

    // status 0, 1인 경우 자동으로 사라지게 설정
    if (isToast) {
        startAutoCloseTimer(popupId);
        
        // 마우스 클릭 이벤트 추가
        popupElement.addEventListener('click', () => {
            popupCloseById(popupId, false);
        });
        
        // 마우스 호버 이벤트 추가
        popupElement.addEventListener('mouseenter', () => {
            pauseAutoCloseTimer(popupId);
        });
        
        popupElement.addEventListener('mouseleave', () => {
            resumeAutoCloseTimer(popupId);
        });
    }

    // 이벤트 리스너 추가 (status 2, 3인 경우에만)
    if (isConfirm) {
        const closeButton = popupElement.querySelector("#popupClose") as HTMLButtonElement;
        const confirmButton = popupElement.querySelector("#popupConfirm") as HTMLButtonElement;
        
        if (closeButton) {
            closeButton.addEventListener("click", () => {
                popupCloseById(popupId, false);
                if (callback) callback(false);
            });
        }
        
        if (confirmButton) {
            confirmButton.addEventListener("click", () => {
                popupCloseById(popupId, true);
                if (callback) callback(true);
            });
        }

        // 포커스 설정
        const focusButton = confirmButton || closeButton;
        focusButton?.focus();
    }
}

export const popupClose = (isConfirm: boolean = false): string | void => {
    // 가장 최근 팝업부터 닫기
    if (popupInstances.length > 0) {
        const lastPopup = popupInstances[popupInstances.length - 1];
        popupCloseById(lastPopup.id, isConfirm);
    }
}

const popupCloseById = (popupId: string, isConfirm: boolean = false): void => {
    const popupInstance = popupInstances.find(instance => instance.id === popupId);
    if (!popupInstance) return;

    const { element, cover, status } = popupInstance;

    if (isConfirm === false) {
        // 모든 경우에 슬라이드 다운 애니메이션 적용
        element.classList.add("slide-down");
        if (cover) {
            cover.classList.add("fade");
        }
        
        setTimeout(() => {
            removePopupInstance(popupId);
        }, 300);
    } else {
        // 확인 버튼을 눌렀을 경우 즉시 제거
        removePopupInstance(popupId);
    }
}

const removePopupInstance = (popupId: string): void => {
    const index = popupInstances.findIndex(instance => instance.id === popupId);
    if (index === -1) return;

    const popupInstance = popupInstances[index];
    
    // 타이머 정리
    if (popupInstance.timer) {
        clearTimeout(popupInstance.timer);
    }
    
    // DOM에서 제거
    popupInstance.element.remove();
    if (popupInstance.cover) {
        popupInstance.cover.remove();
    }
    
    // 배열에서 제거
    popupInstances.splice(index, 1);
    
    // z-index 재조정
    updatePopupZIndex();
}

const updatePopupZIndex = (): void => {
    // 각 팝업의 z-index를 순서대로 조정
    popupInstances.forEach((instance, index) => {
        const zIndex = 5000 + index;
        instance.element.style.zIndex = zIndex.toString();
        if (instance.cover) {
            instance.cover.style.zIndex = (zIndex - 4500).toString();
        }
    });
}

const startAutoCloseTimer = (popupId: string): void => {
    const popupInstance = popupInstances.find(instance => instance.id === popupId);
    if (!popupInstance) return;

    popupInstance.timer = setTimeout(() => {
        popupCloseById(popupId, false);
    }, 5000);
}

const pauseAutoCloseTimer = (popupId: string): void => {
    const popupInstance = popupInstances.find(instance => instance.id === popupId);
    if (!popupInstance || !popupInstance.timer) return;

    popupInstance.isHovered = true;
    clearTimeout(popupInstance.timer);
    popupInstance.timer = undefined;
}

const resumeAutoCloseTimer = (popupId: string): void => {
    const popupInstance = popupInstances.find(instance => instance.id === popupId);
    if (!popupInstance || popupInstance.isHovered !== true) return;

    popupInstance.isHovered = false;
    startAutoCloseTimer(popupId);
}

const popupContent = (description: string, status?: number, ): string => {

    status ??= 1
    if (!description) description = "";
    
    const isToast = status === 0 || status === 1;
    const isConfirm = status === 2 || status === 3;
    
    if (isToast) {
        // Toast 스타일 (status 0, 1) - 버튼 없음
        return `
            <div class="popup__icon ${options[status]["color"]}">
                <i class="fa-solid fa-circle-${options[status]["icon"]}"></i>
            </div>
            <div class="popup__content">
                <div class="popup__description">${description}</div>
            </div>
            <div class="popup__spacer"></div>
        `;
    } else {
        // Toast 스타일 (status 2, 3) - 버튼 있음
        return `
            <div class="popup__icon ${options[status]["color"]}">
                <i class="fa-solid fa-circle-${options[status]["icon"]}"></i>
            </div>
            <div class="popup__content">
                <div class="popup__description">${description}</div>
            </div>
            <div class="popup__button">
                <button type='button' id="popupClose" class="red">취소</button>
                <button type='button' id="popupConfirm">확인</button>
            </div>
        `;
    }
}
