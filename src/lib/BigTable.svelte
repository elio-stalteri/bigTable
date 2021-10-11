<script>
    import { fade } from 'svelte/transition';
    import SearchPanel from './components/SearchPanel.svelte';
    import Header from './components/Header.svelte';
    import Body from './components/Body.svelte';

    import { visibleData, bigTableHeaderConfig, loadingOverlay } from '$lib/controller';

    let scrollLeft = 0;
</script>

<div
    class=" relative flex flex-col w-full h-full overflow-hidden items-start flex-nowrap bg-gray-100
    border rounded border-gray-300 scrollbar-thumb-gray-400 scrollbar-track-gray-200">
    <SearchPanel />
    <div
        class=" flex-grow relative flex w-full h-full overflow-x-hidden overflow-y-hidden
        items-start flex-nowrap flex-col ">
        <Header {scrollLeft} headers={$bigTableHeaderConfig} />
        <Body bind:scrollLeft headers={$bigTableHeaderConfig} data={$visibleData} />
    </div>
    {#if $loadingOverlay.enabled}
        <div
            transition:fade
            class="absolute text-2xl font-extrabold text-shadow-md w-full h-full top-0 left-0
            bg-gray-400 text-white bg-opacity-60 backdrop-blur-sm flex flex-col items-center
            justify-center capitalize z-50 select-none">
            {$loadingOverlay.text}
        </div>
    {/if}
</div>
