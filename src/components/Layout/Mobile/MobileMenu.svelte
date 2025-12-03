<script lang="ts">
    import { menus } from "constants/layout";
    import { currentIndex, currentUrl } from "stores/store";
    import { onMount } from "svelte";
    import { link } from "svelte-routing"
    import { reload } from "utils/helpers";

    let lastPathname: string = "";

    const menuHighlight = () => {
        const currentPath = window.location.pathname;
        
        if (currentPath !== lastPathname) {
            lastPathname = currentPath;
            
            currentIndex.set(0);
            
            for(let i = 0; i < menus.length; i++) {
                if(currentPath === menus[i].url) {
                    currentIndex.set(i);
                    console.log($currentIndex)
                    break;
                }
            }
            
            currentUrl.set(currentPath);
        }
    }

    menuHighlight();

</script>

<ul class="mobile-menu">
    {#each menus as item, index}
        <li class="mobile-menu__list">
            <a 
                class="mobile-menu__list__title" class:mobile-menu-active={$currentIndex == index} 
                use:link 
                href={item.url} 
                on:click={()=>{$currentIndex = index}}
            >
                <!-- <img class="mobile-menu__list__title__icon" src="/src/assets/icon/menu/{currentIndex == index ? item.icon + "-active" : item.icon}.png" alt="menu"> -->
                <i class="{item.icon}"></i>
                <p class="mobile-menu__list__title__text">{item.title}</p>
            </a>
        </li>
    {/each}
</ul>


<style lang="scss">
    @use "./MobileMenu.scss";
</style>