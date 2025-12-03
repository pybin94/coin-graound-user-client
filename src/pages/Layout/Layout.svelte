<script lang="ts">
    import Header from "components/Layout/Header/Header.svelte";
    import Footer from 'components/Layout/Footer/Footer.svelte';
    import { menus } from "constants/layout";
    import { currentSubtitle, currentTitle, currentUrl } from "stores/store";
    import { getPathname } from "utils/helpers";
    import Chat from "pages/Chat/Chat.svelte";
    import MobileMenu from "components/Layout/Mobile/MobileMenu.svelte";

    let sidebarVisibleMobile: boolean = false;
    let container: HTMLElement;

    const handleUrlParams = () => {
        menus.forEach(item => {
            if(getPathname(item.url) == getPathname($currentUrl)) {
                currentTitle.set(item.title)
                currentSubtitle.set(item.title)
                return;
            }
        });
        sidebarVisibleMobile = false;
    };

    $: $currentUrl, handleUrlParams();
</script>

<div class="container" bind:this={container}>
    <Header />
    <main class="app-content">
        <Chat />
        <div class="app-content__body wrap">
        <!-- <div class="app-content__body wrap fade-in"> -->
            <slot />
        </div>
    </main>
</div>
<MobileMenu />
<Footer/>

<style lang="scss">
    @use "./Layout.scss";
</style>