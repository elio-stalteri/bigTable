<script>
	import BodyCell from './BodyCell.svelte';

	export let row = [];
	export let headers = [];
	export let refRow = null;
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
        divide-x-2 
        divide-solid 
        divide-gray-300
		border-b-2
        border-gray-300
        {hidden ? 'invisible -top-full' : ''}"
	style="{!hidden ? `top:${parseInt(topPx)}px`:''}"
>
	{#each headers as header}
		<BodyCell content={row[header.key]} {header} headersLength={headers.length} />
	{/each}
</div>


<style>
	div:hover{
		/* box-shadow:inset 0px -3px 0 0 rgba(209, 213, 219); */
		background-color: rgba(33,150,243,.1);
	}
</style>
