<script lang="ts">
    export let handleGetList: Function;
    export let searchForm: [number, number, string];
    export let placeholder: string = "검색어를 입력하세요";
    export let loading: boolean = false;

    const optionValue = [20, 50, 100];

    const handleSearch = () => {
        if (!loading) {
            handleGetList(1);
        }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    };
</script>

<form class="search-form" on:submit|preventDefault={handleSearch}>
    <!-- <select 
        bind:value={searchForm[0]} 
        on:change={handleSearch}
        disabled={loading}
    >
        {#each optionValue as item}
            <option value={item}>{item}개</option>
        {/each}
    </select> -->

    <!-- <div class="search-form__search"> -->
    <div class="search-form__search__wrap">
        <input
            id="searchInput"
            type="text"
            bind:value={searchForm[2]}
            {placeholder}
            on:keypress={handleKeyPress}
            disabled={loading}
        />
        <button
            type="submit"
            class="search-form__search__wrap__button"
            disabled={loading}
        >
            {#if loading}
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            {:else}
                검색
            {/if}
        </button>
    </div>
    <!-- </div> -->
</form>

<style lang="scss">
    @use "../styles/searchForm.scss";

    .search-form {
        select:disabled,
        input:disabled,
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        &__search__wrap__button {
            .loading-dots {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 2px;

                span {
                    width: 4px;
                    height: 4px;
                    background: #fff;
                    border-radius: 50%;
                    animation: loadingDots 1.4s infinite ease-in-out;

                    &:nth-child(1) {
                        animation-delay: -0.32s;
                    }
                    &:nth-child(2) {
                        animation-delay: -0.16s;
                    }
                    &:nth-child(3) {
                        animation-delay: 0s;
                    }
                }
            }
        }
    }

    @keyframes loadingDots {
        0%,
        80%,
        100% {
            transform: scale(0);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
</style>
