<script>
	import BodyRow from './BodyRow.svelte';
	import { onMount } from 'svelte';
	export let scrollLeft = 0;
	export let data = [];
	export let headers = [];

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

	let started = false;
	onMount(() => {
		started = true;

		tableHeight = refTable.getBoundingClientRect().height;
		if (data.length > 0 && refRow) {
			rowHeight = refRow.getBoundingClientRect().height;
		}
	});

	$: if (started && data.length > 0 && refRow) {
		rowHeight = refRow.getBoundingClientRect().height;
	}
</script>

<div
	bind:this={refTable}
	on:scroll={(e) => {
		scrollLeft = e.target.scrollLeft;
	}}
	class="
        z-10
        relative
        flex-grow 
        w-full 
        h-full
        overflow-y-scroll
        scrollbar-thumb-gray-400 
        scrollbar-track-gray-200"
	on:scroll={onScroll}
>
	<div style="position:relative;width:100%;min-height:{neededHeight}px;visibility:hidden">_</div>
	{#if data.length>0}
		 <BodyRow row={data[0]} {headers} hidden bind:refRow />
	{/if}
	{#if currentIndex - 1 > -1}
		<BodyRow row={data[currentIndex - 1]} {headers} topPx={currentIndexPos - rowHeight} />
	{/if}
	{#each visibleData as _, i}
		<BodyRow row={data[i + currentIndex]} {headers} topPx={i * rowHeight + currentIndexPos} />
	{/each}
</div>
