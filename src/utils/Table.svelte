<script lang="ts">
    export let tableTitle: Array<string>;
    export let tableList: Array<any>;
    export let loading: boolean = false;
    export let emptyMessage: string = "게시글이 없습니다.";
</script>

<div class="table" class:loading>
    <table>
        <thead>
            <tr>
                {#each tableTitle as item}
                    <th>{item}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#if loading}
                <tr class="table__loading">
                    <td colspan="100" class="table__loading">
                        <div class="loading-spinner"></div>
                        <p>데이터를 불러오는 중...</p>
                    </td>
                </tr>
            {:else if tableList && tableList.length > 0}
                <slot />
            {:else}
                <tr class="table__data-none">
                    <td colspan="100" class="table__data-none">
                        <div class="empty-icon">📋</div>
                        <p>{emptyMessage}</p>
                    </td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>

<style lang="scss">
    @use "../styles/table.scss";

    .table {
        &.loading {
            opacity: 0.8;
            pointer-events: none;
        }

        &__loading {
            text-align: center;
            padding: 3rem 1rem !important;
            color: #888;

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(74, 144, 226, 0.3);
                border-top: 3px solid var(--main-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }

            p {
                font-size: 1rem;
                margin: 0;
            }
        }

        &__data-none {
            .empty-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
                opacity: 0.6;
            }

            p {
                margin: 0;
            }
        }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    // 모바일에서 로딩 상태 조정
    @media (max-width: 768px) {
        .table {
            &__loading {
                padding: 2rem 1rem !important;

                .loading-spinner {
                    width: 30px;
                    height: 30px;
                    border-width: 2px;
                }

                p {
                    font-size: 0.9rem;
                }
            }

            &__data-none {
                .empty-icon {
                    font-size: 1.5rem;
                }

                p {
                    font-size: 0.9rem;
                }
            }
        }
    }
</style>