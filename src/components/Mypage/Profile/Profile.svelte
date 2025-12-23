<script lang="ts">
    import MyPage from "pages/MyPage/MyPage.svelte";
    import { handleJoinout } from "services/join";
    import { getUserInfo } from "services/userInfo";
    import { currentSubtitle, currentTitle } from "stores/store";
    import { got } from "utils/helpers";
    import { compressImage } from "utils/imageFormatter";
    import { popup } from "utils/popup";

    let pictureSrc: any;
    let pictures: any;
    let userInfo: {
        id: number;
        nickname: string;
        picture: string;
        email: string;
    };
    let nickname: string;

    const init = async () => {
        userInfo = await getUserInfo();
        nickname = userInfo["nickname"];
        currentTitle.set("프로필");
        currentSubtitle.set("마이페이지");
    };

    const updateuserInfo = async () => {
        let params = {
            nickname,
            picture: pictureSrc,
        };

        const response = await got({
            urlParams: "/user/update",
            method: "PATCH",
            setParams: params,
        });
        popup(response.message, response.statusCode);
    };

    $: if (pictures) {
        for (const picture of pictures) {
            let reader = new FileReader();
            reader.readAsDataURL(picture);
            reader.onload = async () => {
                const compressedPictureSrc = await compressImage(
                    reader.result as string,
                );
                pictureSrc = compressedPictureSrc;
            };
        }
    }

    init();
</script>

<MyPage>
    <form class="profile content" on:submit|preventDefault={updateuserInfo}>
        {#if userInfo}
            <label class="profile__picture-lable" for="picture">
                <div class="profile__picture-lable__img-wrap">
                    {#if !pictureSrc}
                        {#if userInfo["picture"]}
                            <img
                                src={userInfo["picture"]}
                                alt="프로필 이미지"
                            />
                        {:else}
                            <img
                                src="/src/assets/uploads/profile/none{userInfo.id %
                                    5}.png"
                                alt="프로필 이미지"
                            />
                        {/if}
                    {:else}
                        <img src={pictureSrc} alt="프로필 이미지" />
                    {/if}
                </div>
                <i class="profile__picture-lable__icon fa-solid fa-gear"></i>
            </label>
            <input
                id="picture"
                class="profile__picture"
                type="file"
                accept="image/*"
                bind:files={pictures}
            />
            <div class="profile__nickanme">
                <label for="nickname" class="profile__nickanme__label"
                    >닉네임</label
                >
                <input
                    id="nickname"
                    class="profile__nickanme__input"
                    type="text"
                    bind:value={nickname}
                    placeholder="닉네임"
                />
            </div>
            <button class="profile__submit" type="submit">수정</button>

            <button
                class="profile__joinout unset"
                type="button"
                tabindex="0"
                on:click={handleJoinout}
                on:keypress={handleJoinout}
            >
                로그아웃
            </button>
        {/if}
    </form>
</MyPage>

<style lang="scss">
    @use "./Profile.scss";
</style>
