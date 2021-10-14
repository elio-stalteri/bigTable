<script>
	import { filterSearchSortConfig, sort } from '$lib/controller';

	export let scrollLeft = 0;
	export let headers = [];

	function onScroll(e) {
		console.log(e);
	}
</script>

<div
	style="transform:translateX(-{scrollLeft}px)"
    on:scroll={onScroll}
	class=" z-0 relative flex flex-row items-center flex-nowrap min-w-full divide-x-2 divide-solid divide-gray-300 border-b-2 border-gray-300 bg-gray-200">
	{#each headers as header}
		<div class="py-2 flex flex-row items-center justify-center cursor-pointer" style="min-width:{100 / headers.length}%;width:{header.width || 200}px" on:click={() => sort(header.key)}>
			{header.name}
			{#if $filterSearchSortConfig.sort[header.key] && Object.keys($filterSearchSortConfig.sort[header.key]).indexOf('desc') > -1}
				<div class="relative">
					<svg class="w-4 h-4 ml-1 relative" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3
							3a1 1 0 101.414 1.414L13 10.414V16z" />

					</svg>
					{#if $filterSearchSortConfig.sort[header.key]}
						<span class="absolute bg-white text-xs rounded-full ring-2 ring-gray-800 w-3 h-3 -top-1 -right-3 flex items-center justify-center font-extrabold transform scale-75">
							{$filterSearchSortConfig.sort[header.key].order}
						</span>
					{/if}
				</div>
			{:else if $filterSearchSortConfig.sort[header.key] && Object.keys($filterSearchSortConfig.sort[header.key]).indexOf('asc') > -1}
				<div class="relative">
					<svg class="w-4 h-4 ml-1 relative" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414
							0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />

					</svg>
					{#if $filterSearchSortConfig.sort[header.key]}
						<span class="absolute bg-white text-xs rounded-full ring-2 ring-gray-800 w-3 h-3 -top-1 -right-3 flex items-center justify-center font-extrabold transform scale-75">
							{$filterSearchSortConfig.sort[header.key].order}
						</span>
					{/if}
				</div>
			{/if}

		</div>
	{/each}
</div>
