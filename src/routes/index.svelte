<script>
	import BigTable from '$lib/BigTable.svelte';
	// import BigTableDesign from '$lib/bigTableDesign.svelte';
</script>

<div class="absolute inset-8 ">
    <BigTable />
</div>

<!-- <BigTableDesign></BigTableDesign> -->


<style>
    .containerTable{
        position:absolute;
        top: 20px;
        left: 10vw;
        width: 80vw;
        height: calc(100vh - 40px);
    }

    .containerTable :global(::-webkit-scrollbar) {
		width: 6px;
	}
	.containerTable :global(::-webkit-scrollbar-track) {
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	}
	.containerTable :global(::-webkit-scrollbar-thumb) {
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	}

	/* :global(body) {
		background: -webkit-linear-gradient(left, #25c481, #25b7c4);
		background: linear-gradient(to right, #25c481, #25b7c4);
		font-family: 'Roboto', sans-serif;
	}	 */
</style>