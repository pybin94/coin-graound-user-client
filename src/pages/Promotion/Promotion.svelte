<script lang="ts">
    import MenuHeader from "components/Layout/MenuHeader/MenuHeader.svelte";
    import PromotionCard from "components/Promotion/PromotionCard.svelte";
    import { type MenuHeaderModel } from "models/layout";
    import { type PromotionModel } from "models/promotion";

    const menuHeader: MenuHeaderModel = {
        icon: "fa-solid fa-coins",
        title: "프로모션",
        subTitle: "레퍼럴 및 추천인 이벤트",
    }

    const promotionList: PromotionModel[] = [
        {
            link: "https://www.bithumb.com/react/referral/guide?referral=36T4DE1BNA",
            exchange: "bitthumb",
            icon: "bitthumb.jpg",
            title: "빗썸 친구초대 이벤트",
            explanation: "🎉 가입축하 20,000원 + 계좌연결 50,000원",
            detail: "앱 → 더보기 → 쿠폰/코드 등록 → 초대 코드 입력",
            code: "36T4DE1BNA",
            background: "#ffb703, #fb8500"
        },
        {
            link: "https://accounts.binance.com/register?ref=COINSELTDA",
            exchange: "binance",
            icon: "binance.jpg",
            title: "바이낸스 현물/선물",
            explanation: "🎉 현물거래 선물 거레 모두 페이백 50% ‼️",
            detail: "링크 클릭후 가입 → 페이백 50%",
            code: "COINSELTDA",
            background: "#2c3644, #1a1c24"
        }
    ]
    
</script>

<main class="promotion content">
    <MenuHeader {menuHeader} />
    {#each promotionList as promotionInfo}
        <PromotionCard 
            {promotionInfo}
        />
    {/each}
</main>

<style lang="scss">
    @use "./Promotion.scss";
</style>