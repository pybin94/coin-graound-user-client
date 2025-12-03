<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { navigate } from "svelte-routing";

    let intervalBanner: any;

    onMount(()=>{
        intervalBanner = setTimeout(()=>{
            navigate("/", {replace: true})
        }, 300)
    })

    onDestroy(()=>{
        clearInterval(intervalBanner);
    })
</script>