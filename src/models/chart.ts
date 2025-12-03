export interface TickerInfo extends SymbolInfo {
    ty: "ticker"; // 데이터 타입 (현재가 정보)
    cd: string; // 마켓 코드 (예: "KRW-BTC")

    op: number; // 시가
    hp: number; // 고가
    lp: number; // 저가
    tp: number; // 현재가
    pcp: number; // 전일 종가

    c: TickerChange; // 전일 대비 상승/하락/보합
    cp: number; // 전일 대비 부호 없는 값
    scp: number; // 전일 대비 값 (부호 포함)
    cr: number; // 전일 대비 부호 없는 등락율
    scr: string; // 전일 대비 등락율 (부호 포함)

    bp: string; // 직전 체결 가격

    tv: number; // 가장 최근 거래량
    atv: number; // 누적 거래량 (UTC 0시 기준)
    atv24h: number; // 24시간 누적 거래량
    atp: number; // 누적 거래대금 (UTC 0시 기준)
    atp24h: number; // 24시간 누적 거래대금

    tdt: string; // 최근 거래 일자 (yyyyMMdd)
    ttm: string; // 최근 거래 시각 (HHmmss)
    ttms: number; // 체결 타임스탬프 (milliseconds)

    ab: TickerAskBid; // 매수/매도 구분
    aav: number; // 누적 매도량
    abv: number; // 누적 매수량

    h52wp: number; // 52주 최고가
    h52wdt: string; // 52주 최고가 달성일 (yyyy-MM-dd)
    l52wp: number; // 52주 최저가
    l52wdt: string; // 52주 최저가 달성일 (yyyy-MM-dd)

    ms: TickerMarketState; // 거래 상태
    mw: TickerMarketWarning; // 유의 종목 여부

    its: boolean; // 거래 정지 여부
    dd: Date; // 거래지원 종료일



    tms: number; // 타임스탬프 (milliseconds)
    st: "SNAPSHOT" | "REALTIME"; // 스트림 타입

    tc: string; // ticketColor
}

export interface SymbolInfo{
    id?: number;
    kr?: string; // 한글 이름
    en?: string; // 영어 이름
    s?: string;  // 심볼
    cu?: string; // currency
    ef?: string; // P가 있으면 선물 없으면 현물
    p?: string;  // prefix
}

export enum TickerChange {
    RISE = "RISE",
    FALL = "FALL",
    EVEN = "EVEN",
}

export enum TickerMarketState {
    PREVIEW = "PREVIEW",    // 입금지원
    ACTIVE = "ACTIVE",      // 거래지원가능
    DELISTED = "DELISTED",  // 거래지원종료
}

export enum TickerAskBid {
    ASK = "ASK",
    BID = "BID",
}

export enum TickerMarketWarning {
    NONE = "NONE",          // 해당없음
    CAUTION = "CAUTION",    // 투자유의
}

export enum Exchange {
    UPBIT = "1",
    BITHUMB = "2",
    BINANCE = "3", 
    BINANCEF = "4",
    BYBIT = "5",
    BYBITF = "6",
    BITGET = "7",
    BITGETF = "8",
    OKX = "9",
    OKXF = "10",
}

export interface BinanceTicker {
    A: string;  // 최우선 매도 호가 수량
    B: string;  // 최우선 매수 호가 수량
    C: number;  // 통계 시간 범위 시작 시간
    E: number;  // 이벤트 시간
    F: number;  // 첫 번째 체결 트랜잭션 ID
    L: number;  // 마지막 체결 트랜잭션 ID
    O: number;  // 통계 시간 범위 시작 시간
    P: string;  // 가격 변동률 (%)
    Q: string;  // 마지막 체결량
    a: string;  // 최우선 매도 호가
    b: string;  // 최우선 매수 호가
    c: string;  // 최근 체결 가격
    e: string;  // 이벤트 타입 ("24hrTicker")
    h: string;  // 24시간 내 최고가
    l: string;  // 24시간 내 최저가
    n: number;  // 24시간 내 총 체결 횟수
    o: string;  // 24시간 전 가격
    p: string;  // 가격 변동 값
    q: string;  // 24시간 내 총 체결 금액
    s: string;  // 심볼
    v: string;  // 24시간 내 총 체결량
    w: string;  // 24시간 내 평균 가격
    x: string;  // 직전 체결 가격
}
