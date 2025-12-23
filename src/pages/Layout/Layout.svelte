<script lang="ts">
    import Header from "components/Layout/Header/Header.svelte";
    import Footer from "components/Layout/Footer/Footer.svelte";
    import { menus } from "constants/layout";
    import {
        currentIndex,
        currentSubtitle,
        currentTitle,
        currentUrl,
    } from "stores/store";
    import { getPathname } from "utils/helpers";
    import Chat from "pages/Chat/Chat.svelte";
    import MobileMenu from "components/Layout/Mobile/MobileMenu.svelte";

    let sidebarVisibleMobile: boolean = false;
    let container: HTMLElement;
    let lastPathname: string = "";

    const handleUrlParams = () => {
        menus.forEach((item) => {
            if (getPathname(item.url) == getPathname($currentUrl)) {
                currentTitle.set(item.title);
                currentSubtitle.set(item.title);
                return;
            }
        });
        sidebarVisibleMobile = false;
    };

    const menuHighlight = () => {
        const currentPath = window.location.pathname;

        if (currentPath !== lastPathname) {
            lastPathname = currentPath;

            currentIndex.set(-1);

            for (let i = 0; i < menus.length; i++) {
                if (currentPath === menus[i].url) {
                    currentIndex.set(i);
                    break;
                }
            }

            currentUrl.set(currentPath);
        }
    };

    $: if ($currentUrl) {
        handleUrlParams();
        menuHighlight();
    }
</script>

<div class="container" bind:this={container}>
    <Header />
    <main class="app-content">
        <Chat />
        <div class="app-content__body wrap">
            <slot />
        </div>
    </main>
</div>

<MobileMenu />
<Footer />

<style lang="scss">
    @use "./Layout.scss";
</style>
