<!-- <svelte:options accessors={true} /> -->
<script>
	import { onMount } from 'svelte';
	const data = new Array(2000000).fill(0).map((v, i) => 'test woow ' + (i + 1));

	console.log('data', data.length);

	function onScroll(e) {
		innerHeight = refTable.scrollHeight;
		scrollPercentage = refTable.scrollTop / refTable.scrollHeight;
		currentIndex = Math.min(
			Math.ceil(data.length * scrollPercentage),
			data.length - numberOfVisibleRows
		);
		currentIndexPos = (innerHeight * (currentIndex + 1)) / data.length;
		// console.table({ scrollPercentage, currentIndex });
	}
	let refRow;
	let refTable;
	let tableHeight;
	let rowHeight;

	$: numberOfVisibleRows =
		tableHeight && rowHeight ? Math.ceil((tableHeight / rowHeight) * 1.2) : 0;
	// $: console.log("numberOfVisibleRows",numberOfVisibleRows)

	$: visibleData = new Array(numberOfVisibleRows).fill(0);

	let currentIndex = 0;

	$: neededHeight = data && rowHeight ? data.length * rowHeight : 0;

	let innerHeight = 0;
	let scrollPercentage = 0;
	let currentIndexPos = 0;

	$: adjustCoefficent =
		neededHeight && innerHeight && currentIndex ? neededHeight / innerHeight : 1;

	$: console.log('padding bottom ', neededHeight, innerHeight, adjustCoefficent);

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
