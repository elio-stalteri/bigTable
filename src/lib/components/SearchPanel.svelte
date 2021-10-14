<script>
	import { refreshTableHeightTrigger, search, searchProgress } from '$lib/controller';
	import { slide } from 'svelte/transition';
	import Svelecte from 'svelecte';

	let open = false;
	function transitionEnds() {
		refreshTableHeightTrigger();
	}

	let options = [
		{
			label: 'wooow1',
			value: 1,
		},
		{
			label: 'wooow2',
			value: 2,
		},
		{
			label: 'wooow3',
			value: 3,
		},
		{
			label: 'wooow4',
			value: 4,
		},
		{
			label: 'wooow5',
			value: 5,
		},
		{
			label: 'wooow6',
			value: 6,
		},
	];

	let selection = null;
	let value = null;

	let searchValue = '';
</script>

<style lang="postcss">
	.column-select {
		@apply w-48 flex-grow-0 bg-white rounded;
	}
	.column-select > div {
		@apply rounded;
	}
</style>

<div class="bg-gray-200 w-full border-b-2 border-gray-300 flex flex-col z-50">
	<div class="text-sm leading-none capitalize flex flex-row items-center py-1 px-2 w-full divide-x-2 divide-gray-300">
		{#each [0, 0, 0, 0] as item}
			<span class="p-2 flex cursor-pointer rounded hover:bg-gray-300 hover:bg-opacity-50 transition-all duration-500" on:click={() => (open = !open)}>
				<svg class="w-3 h-3 mr-1 transition-transform {open ? 'rotate-90' : ''}" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
				</svg>
				search
			</span>
		{/each}
	</div>
	{#if open}
		<div class="relative border-t-2 border-gray-300 flex flex-row p-2" transition:slide on:outroend={transitionEnds} on:introend={transitionEnds}>
			<input type="text" bind:value={searchValue} class="rounded border-[1px] border-gray-300 focus:shadow-none focus:outline-none" />
			<button on:click={() => search(searchValue)}>Search</button>
            <div class="absolute bottom-0 left-0 h-1 w-full bg-gray-50"><div class="absolute top-0 left-0 bg-green-500 h-full" style="width:{$searchProgress}%"></div></div>
			<div class="column-select ">
				<Svelecte {options} bind:selection bind:value placeholder="Select country" />
			</div>
		</div>
	{/if}
</div>
