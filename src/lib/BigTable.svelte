<script>
	import Header from './components/Header.svelte';
	import Body from './components/Body.svelte';

	import { visibleData, bigTableHeaderConfig } from '$lib/controller';

	let scrollLeft = 0;
</script>

<div
	class="
        relative 
        flex 
        w-full 
        h-full 
        overflow-x-hidden 
        overflow-y-hidden 
        items-start 
        flex-nowrap 
        flex-col 
        bg-gray-100 
        border
        rounded
        border-gray-300
        scrollbar-thumb-gray-400 
        scrollbar-track-gray-200"
>
	<Header {scrollLeft} headers={$bigTableHeaderConfig} />
	<Body bind:scrollLeft headers={$bigTableHeaderConfig} data={$visibleData} />
</div>
