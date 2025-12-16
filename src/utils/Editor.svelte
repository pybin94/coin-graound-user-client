<script lang="ts">
    /** Usage
    * onTextChange: 에디터 데이터
    * data: 기본값, 템플릿, placeholder
    *
    * const onTextChange = (event: any) => {
    *   let value = event.detail
    * }
    * <BoardEditor {onTextChange} data={data} placeholder={placeholder}/>
    * 
    */

    import { quill } from "svelte-quill";
    import { wait } from './helpers';

    export let onTextChange: any;
    export let data: string = "";
    export let placeholder: string = "내용을 입력해 주세요.";
  
    var toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['link', 'image'],

        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],

        [{ 'align': [] }],

        ['clean'],
    ];

    const options = {
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: placeholder,
        theme: 'snow',
        plainclipboard: true
    }

    const tamplate = async () => {
        await wait(100)
        let editor = document.querySelectorAll(".ql-editor")
        if (editor.length == 0) {
            return tamplate()
        }
        editor[editor.length-1].innerHTML = data
    }

    $: data, tamplate()

</script>
  
<svelte:head>
    <link rel="preconnect" href="https://cdn.quilljs.com">
    <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.7/quill.snow.css">
</svelte:head>
  
<div class="editor" use:quill={options} on:text-change={onTextChange}/>

<style lang="scss">
    @use "../styles/editor.scss";
</style>