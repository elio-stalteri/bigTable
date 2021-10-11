<script>
    import { refreshTableHeightTrigger } from '$lib/controller';
    import { slide } from 'svelte/transition';

    let open = false;
    function transitionEnds() {
        refreshTableHeightTrigger();
    }
</script>

<div class="bg-gray-200 w-full border-b-2 border-gray-300 flex flex-col">
    <div
        class="text-sm leading-none capitalize flex flex-row items-center py-1 px-2 w-full 
        divide-x-2 divide-gray-300">
        {#each [0, 0, 0, 0] as item}
            <span class="p-2 flex cursor-pointer rounded hover:bg-gray-300 hover:bg-opacity-50 transition-all duration-500" on:click={() => (open = !open)}>
                <svg
                    class="w-3 h-3 mr-1 transition-transform {open ? 'rotate-90' : ''}"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4
                        4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                </svg>
                search
            </span>
        {/each}
    </div>
    {#if open}
        <div
            class="border-t-2 border-gray-300"
            transition:slide
            on:outroend={transitionEnds}
            on:introend={transitionEnds}>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
        </div>
    {/if}
</div>
