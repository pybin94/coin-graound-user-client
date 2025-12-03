import sequence from "svelte-sequential-preprocessor";
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
export default {
  preprocess: sequence([vitePreprocess()])
};
