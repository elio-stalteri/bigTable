<script>
	import BodyCell from './BodyCell.svelte';

	export let row = [];
	export let headers = [];
	export let refRow;
	export let hidden = false;
	export let topPx = 0;
</script>

<div
	bind:this={refRow}
	class="
        absolute
        flex 
        flex-row 
        items-center 
        flex-nowrap 
        divide-x 
        divide-solid 
        divide-gray-300
        {hidden ? 'invisible -top-full' : ''}"
	style={!hidden && `top:${topPx}px`}
>
	{#each headers as header}
		<BodyCell content={row[header.key]} {header} headersLength={headers.length} />
	{/each}
</div>
