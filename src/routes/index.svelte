<script>
	import BigTable from '$lib/bigTable.svelte';
	import BigTableDesign from '$lib/bigTableDesign.svelte';
</script>

<div class="containerTable">
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
</style>