<script lang="ts">
    import { menus } from "constants/layout";
    import { currentIndex } from "stores/store";
    import { link } from "svelte-routing";
</script>

<ul class="mobile-menu">
    {#each menus as item, index}
        <li class="mobile-menu__list">
            <a
                class="mobile-menu__list__title"
                class:mobile-menu-active={$currentIndex == index}
                use:link
                href={item.url}
                on:click={() => {
                    $currentIndex = index;
                }}
            >
                <i class={item.icon}></i>
                <p class="mobile-menu__list__title__text">{item.title}</p>
            </a>
        </li>
    {/each}
</ul>

<style lang="scss">
    @use "./MobileMenu.scss";
</style>
