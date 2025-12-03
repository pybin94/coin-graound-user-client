<script lang="ts">
    export let width: string = "100%"; // 너비
    export let height: string = "1rem"; // 높이
    export let radius: string = "4px"; // 모서리 둥글기
    export let duration: string = "1.2s"; // 애니메이션 속도
</script>

<style>
    .skeleton {
        display: inline-block;
        background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
        background-size: 200% 100%;
        animation: shimmer var(--duration, 1.2s) infinite linear;
        border-radius: var(--radius, 4px);
        width: var(--width, 100%);
        height: var(--height, 1rem);
    }

    @keyframes shimmer {
        0% { background-position: -100% 0; }
        100% { background-position: 100% 0; }
    }
</style>

<div 
    class="skeleton"
    style="
        --width: {width}; 
        --height: {height}; 
        --radius: {radius}; 
        --duration: {duration};
    ">
</div>