<!-- <svelte:options accessors={true} /> -->
<script>
	import Lazy from "lazy.js"
	import { onMount } from 'svelte';
	export let data = new Array(1_000_000).fill({ test: 'wooow ',test2:"wooowowo" });
	export let headers = Object.keys(data[0]);

	console.log(Lazy)

	function onScroll(e) {
		if (numberOfVisibleRows >= data.length) return;
		const innerHeight = refTable.scrollHeight;
		const scrollPercentage = refTable.scrollTop / refTable.scrollHeight;
		const maxScrollPercentage = 1 - (numberOfVisibleRows * rowHeight) / refTable.scrollHeight;
		const maxIndex = Math.min(
			Math.max(Math.ceil(data.length * maxScrollPercentage), 0),
			data.length - numberOfVisibleRows
		);
		const lengthAdjust = data.length - (maxIndex + numberOfVisibleRows - 1);
		const dataLength = data.length + (neededHeight > refTable.scrollHeight ? lengthAdjust : 0);
		currentIndex = Math.min(
			Math.max(Math.ceil(dataLength * scrollPercentage), 0),
			data.length - numberOfVisibleRows
		);
		currentIndexPos = (innerHeight * currentIndex) / dataLength;
	}
	let refRow;
	let refTable;
	let tableHeight;
	let rowHeight;

	$: numberOfVisibleRows = tableHeight && rowHeight ? Math.ceil(tableHeight / rowHeight) : 0;

	$: visibleData =
		numberOfVisibleRows && numberOfVisibleRows > 0
			? new Array(Math.min(numberOfVisibleRows, data.length)).fill(0)
			: [];

	let currentIndex = 0;

	$: neededHeight = data && rowHeight ? data.length * rowHeight : 0;

	let currentIndexPos = 0;

	onMount(() => {
		tableHeight = refTable.getBoundingClientRect().height;
		rowHeight = refRow.getBoundingClientRect().height;
	});
</script>

<div class="containerTable">
	<div class="headers">
		{#each headers as h}
			<div class="header-col" style="width:{(1 / headers.length) * 100}%">{h}</div>
		{/each}
	</div>
	<div class="bigTable" on:scroll={onScroll} bind:this={refTable}>
		<div style="position:relative;width:100%;min-height:{neededHeight}px;visibility:hidden">_</div>
		<div class="row" style="visibility:hidden; top:-300%" bind:this={refRow}>
			{#each headers as h}
				<div class="col" style="width:{(1 / headers.length) * 100}%">{data[0][h]}</div>
			{/each}
		</div>
		{#if currentIndex - 1 > -1}
			<div class="row" style="top:{currentIndexPos - rowHeight}px">
				{#each headers as h}
					<div class="col" style="width:{(1 / headers.length) * 100}%">
						{currentIndex} - {data[currentIndex - 1][h]}
					</div>
				{/each}
			</div>
		{/if}
		{#each visibleData as _, i}
			<div class="row" style="top:{i * rowHeight + currentIndexPos}px">
				{#each headers as h}
					<div class="col" style="width:{(1 / headers.length) * 100}%">
						{currentIndex + i + 1} - {data[i + currentIndex][h]}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.containerTable {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: space-evenly;
		align-items: center;
		position: relative;
		overflow-x: auto;
		overflow-y: hidden;
		background: white;
	}
	.bigTable {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: auto;
	}
	.row {
		width: 100%;
		position: absolute;
		top: 0;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-evenly;
		align-items: center;
	}
	.headers {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-evenly;
		align-items: center;
		width: 100%;
	}
	.header-col,
	.col {
		border: 1px solid black;
		position: relative;
		padding: 10px;
	}


	::-webkit-scrollbar {
		width: 6px;
	}
	::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	}
	::-webkit-scrollbar-thumb {
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	}
</style>
