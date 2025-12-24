<script lang="ts">
    import { prevUrl } from "stores/url.store";
    import { link } from "svelte-routing";
    import { getCookie, setCookie } from "utils/helpers";

    const socialList = [
        {
            name: "Google",
            provider: "google",
            img: "google.svg",
        },
        {
            name: "Naver",
            provider: "naver",
            img: "naver.svg",
        },
        {
            name: "Kakao",
            provider: "kakao",
            img: "kakao.png",
        },
        // {
        //     name: "Apple",
        //     provider: "apple",
        //     img: "apple.svg",
        // },
    ];

    const setLatestJoin = (provider: string) => {
        setCookie("latest-join", provider);
    };
</script>

<div class="no-layout content">
    <section class="join">
        <a use:link href="/" class="join__logo">
            <img src="/src/assets/logo.png" alt="사이트 로고" />
        </a>
        <div class="join__social">
            {#each socialList as item}
                {#if getCookie("latest-join") && getCookie("latest-join") == item.provider}
                    <div class="join__divider">
                        <div class="join__divider__line left"></div>
                        <p>최근 로그인</p>
                        <div class="join__divider__line right"></div>
                    </div>
                    <a
                        class="join__social__icon {item.provider}"
                        href={`${process.env.URL}/${item.provider}?state=${encodeURIComponent($prevUrl)}`}
                        on:click={() => {
                            setLatestJoin(item.provider);
                        }}
                    >
                        <img src="/src/assets/icon/social/{item.img}" alt="" />
                        <p>{item.name}로 시작하기</p>
                    </a>
                    <div class="join__divider">
                        <div class="join__divider__line left"></div>
                        <p>OR</p>
                        <div class="join__divider__line right"></div>
                    </div>
                {/if}
            {/each}
            {#each socialList as item}
                {#if !getCookie("latest-join") || getCookie("latest-join") != item.provider}
                    <a
                        class="join__social__icon {item.provider}"
                        href={`${process.env.URL}/${item.provider}?state=${encodeURIComponent($prevUrl)}`}
                        on:click={() => {
                            setLatestJoin(item.provider);
                        }}
                    >
                        <img src="/src/assets/icon/social/{item.img}" alt="" />
                        <p>{item.name}로 시작하기</p>
                    </a>
                {/if}
            {/each}

            <button
                class="join__social__icon apple"
                on:click={() => {
                    history.go(-1);
                }}
            >
                <p>뒤로가기</p>
            </button>
        </div>

        <div class="join__footer">
            <p>안전하고 빠른 소셜 로그인으로 시작하세요</p>
            <p>개인정보는 안전하게 보호됩니다</p>
            <h6 style="text-decoration-line: line-through;">
                코인그라운드는 당신의 개인정보에 관심 없습니다
            </h6>
        </div>
    </section>
</div>

<style lang="scss">
    @use "./Join.scss";
</style>
