<script>
	import BigTable from '$lib/bigTable.svelte';
</script>

<div class="containerTable">
    <BigTable />
</div>


<style>
    .containerTable{
        position:absolute;
        top: 20px;
        left: 10vw;
        width: 80vw;
        height: calc(100vh - 40px);
    }
</style>