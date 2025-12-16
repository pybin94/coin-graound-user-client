<script lang="ts">
    import { type PromotionModel } from "models/promotion";

    export let promotionInfo: PromotionModel;
</script>

<a
    href="{promotionInfo.link}"
    target="_blank"
    class="promotion-link"
>
    <main class="promotion-format card">
        <div class="promotion-format__left">
            <img
                class="promotion-format__left__icon"
                src="/src/assets/images/{promotionInfo.icon}"
                alt="{promotionInfo.exchange}"
            />            
        </div>

        <div class="promotion-format__right">
            <div class="promotion-format__right__header">
                <img
                    class="promotion-format__right__header__icon"
                    src="/src/assets/images/{promotionInfo.icon}"
                    alt="{promotionInfo.exchange}"
                />
                <p class="promotion-format__right__header__title">
                    {promotionInfo.title}
                </p>
            </div>

            <div class="promotion-format__right__body">
                <h3 class="promotion-format__right__body__explanation">
                    {promotionInfo.explanation}
                </h3>
                <p class="promotion-format__right__body__detail">
                    {promotionInfo.detail}
                </p>
            </div>
            <div class="promotion-format__right__footer">
                <h2 
                    class="promotion-format__right__footer__code"
                    style="background: linear-gradient(135deg, {promotionInfo.background});"
                >
                    {promotionInfo.code}
                </h2>
                <div class="promotion-format__right__footer__cta">
                    지금 참여하기 →
                </div>
            </div>
        </div>
    </main>
</a>

<style lang="scss">
    @use "./PromotionCard.scss";
</style>