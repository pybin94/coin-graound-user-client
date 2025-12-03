<script lang="ts">
    export let fullPage: number;
    export let currentPage: number;
    export let handleGetList: Function;
    export let loading: boolean = false;

    const handlePageClick = (page: number) => {
        if (!loading && page !== currentPage && page >= 1 && page <= fullPage) {
            handleGetList(page);
        }
    };

    const handleFirstPage = () => {
        if (!loading && currentPage > 1) {
            handleGetList(1);
        }
    };

    const handleLastPage = () => {
        if (!loading && currentPage < fullPage) {
            handleGetList(fullPage);
        }
    };

    const handlePrevPage = () => {
        if (!loading && currentPage > 1) {
            handleGetList(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (!loading && currentPage < fullPage) {
            handleGetList(currentPage + 1);
        }
    };
</script>

<div class="pagenation" class:loading>
    {#if fullPage}
        <ul>
            <li class="shift first">
                <a 
                    href="#" 
                    class="{currentPage > 1 ? 'active' : ''}" 
                    on:click|preventDefault={handleFirstPage}
                    title="첫 페이지로 이동"
                >
                    <i class="fa-solid fa-angles-left"></i>
                </a>
            </li>
            
            <li class="shift">
                <a 
                    href="#" 
                    class="{currentPage > 1 ? 'active' : ''}" 
                    on:click|preventDefault={handlePrevPage}
                    title="이전 페이지로 이동"
                >
                    <i class="fa-solid fa-angle-left"></i>
                </a>
            </li>
            
            {#if fullPage > 4 && currentPage >= 3}
                <li class="shift">
                    <a href="#" title="페이지 건너뛰기">
                        <i class="fa-solid fa-ellipsis"></i>
                    </a>
                </li>
            {/if}
            
            {#if fullPage < 5}
                {#each { length: fullPage } as _, i}
                    <li class="page {currentPage == i + 1 ? 'active' : ''}">
                        <a 
                            href="#" 
                            on:click|preventDefault={() => handlePageClick(i + 1)}
                            title="{i + 1}페이지로 이동"
                        >
                            {i + 1}
                        </a>
                    </li>
                {/each}
            {:else}
                {#if currentPage <= 2} 
                    <li class="page {currentPage == 1 ? 'active' : ''}">
                        <a href="#" on:click|preventDefault={() => handlePageClick(1)} title="1페이지로 이동">1</a>
                    </li>
                    <li class="page {currentPage == 2 ? 'active' : ''}">
                        <a href="#" on:click|preventDefault={() => handlePageClick(2)} title="2페이지로 이동">2</a>
                    </li>
                    <li class="page">
                        <a href="#" on:click|preventDefault={() => handlePageClick(3)} title="3페이지로 이동">3</a>
                    </li>
                    <li class="page">
                        <a href="#" on:click|preventDefault={() => handlePageClick(4)} title="4페이지로 이동">4</a>
                    </li>
                {:else if currentPage >= fullPage - 1} 
                    <li class="page">
                        <a href="#" on:click|preventDefault={() => handlePageClick(fullPage - 3)} title="{fullPage - 3}페이지로 이동">{fullPage - 3}</a>
                    </li>
                    <li class="page">
                        <a href="#" on:click|preventDefault={() => handlePageClick(fullPage - 2)} title="{fullPage - 2}페이지로 이동">{fullPage - 2}</a>
                    </li>
                    <li class="page {currentPage == fullPage - 1 ? 'active' : ''}">
                        <a href="#" on:click|preventDefault={() => handlePageClick(fullPage - 1)} title="{fullPage - 1}페이지로 이동">{fullPage - 1}</a>
                    </li>
                    <li class="page {currentPage == fullPage ? 'active' : ''}">
                        <a href="#" on:click|preventDefault={() => handlePageClick(fullPage)} title="{fullPage}페이지로 이동">{fullPage}</a>
                    </li>
                {:else} 
                    <li class="page">
                        <a href="#" on:click|preventDefault={() => handlePageClick(currentPage - 1)} title="{currentPage - 1}페이지로 이동">{currentPage - 1}</a>
                    </li>
                    <li class="page active">
                        <a href="#" on:click|preventDefault={() => handlePageClick(currentPage)} title="{currentPage}페이지 (현재)">{currentPage}</a>
                    </li>
                    <li class="page">
                        <a href="#" on:click|preventDefault={() => handlePageClick(currentPage + 1)} title="{currentPage + 1}페이지로 이동">{currentPage + 1}</a>
                    </li>
                {/if}
            {/if}
            
            {#if fullPage >= 5 && currentPage <= fullPage - 2}
                <li class="shift">
                    <a href="#" title="페이지 건너뛰기">
                        <i class="fa-solid fa-ellipsis"></i>
                    </a>
                </li>
            {/if}
            
            <li class="shift">
                <a 
                    href="#" 
                    class="{currentPage < fullPage ? 'active' : ''}" 
                    on:click|preventDefault={handleNextPage}
                    title="다음 페이지로 이동"
                >
                    <i class="fa-solid fa-angle-right"></i>
                </a>
            </li>
            
            <li class="shift last">
                <a 
                    href="#" 
                    class="{currentPage < fullPage ? 'active' : ''}" 
                    on:click|preventDefault={handleLastPage}
                    title="마지막 페이지로 이동"
                >
                    <i class="fa-solid fa-angles-right"></i>
                </a>
            </li>
        </ul>
    {/if}
</div>

<style lang="scss">
    @use "../styles/pagenation.scss";

    .pagenation {
        &.loading {
            opacity: 0.7;
            pointer-events: none;
        }

        ul li {
            &.shift a:not(.active) {
                cursor: not-allowed;
                opacity: 0.5;
            }

            &.page a {
                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
</style>