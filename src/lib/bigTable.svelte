<!-- <svelte:options accessors={true} /> -->
<script>
	import { onMount } from 'svelte';
	const data = new Array(15000000).fill(0).map((v, i) => 'test woow ' + (i + 1));

	// console.log('data', data.length);

	function onScroll(e) {
		const innerHeight = refTable.scrollHeight;
		const dataLength = data.length + numberOfVisibleRows*neededHeight/innerHeight;
		const scrollPercentage = refTable.scrollTop / refTable.scrollHeight;
		currentIndex = Math.min(
			Math.max(Math.ceil(dataLength * scrollPercentage), 0),
			data.length - numberOfVisibleRows
		);
		currentIndexPos = (innerHeight * (currentIndex + 1)) / dataLength;
		// console.table({ scrollPercentage, currentIndex });
	}
	let refRow;
	let refTable;
	let tableHeight;
	let rowHeight;

	$: numberOfVisibleRows = tableHeight && rowHeight ? Math.ceil(tableHeight / rowHeight) : 0;


	$: visibleData =
		numberOfVisibleRows && numberOfVisibleRows > 0 ? new Array(numberOfVisibleRows).fill(0) : [];

	let currentIndex = 0;

	$: neededHeight = data && rowHeight ? data.length * rowHeight : 0;

	let currentIndexPos = 0;

	onMount(() => {
		tableHeight = refTable.getBoundingClientRect().height;
		rowHeight = refRow.getBoundingClientRect().height;
	});
</script>

<div class="table" on:scroll={onScroll} bind:this={refTable}>
	<div style="position:relative;width:100%;min-height:{neededHeight}px;visibility:hidden">_</div>
	<div class="row" style="visibility:hidden; top:-300%" bind:this={refRow}>0</div>
	{#each visibleData as _, i}
		<div class="row" style="top:{i * rowHeight + currentIndexPos}px">
			{data[i + currentIndex]}
		</div>
		<!-- <div class="row" style="top:{(i + currentIndex) * rowHeight}px">{data[i + currentIndex]}</div> -->
	{/each}
</div>

<style>
	.table {
		width: 500px;
		max-height: 500px;
		height: 500px;
		position: relative;
		overflow: scroll;
	}
	.row {
		width: 100%;
		padding: 10px;
		font-size: 16px;
		line-height: 16px;
		position: absolute;
		top: 0;
		border: 1px solid black;
	}
</style>
