<script>
	export let scrollLeft = 0;
	export let headers = [];
</script>

<div
	style="transform:translateX(-{scrollLeft}px)"
	class="
            z-0 
            relative 
            flex 
            flex-row 
            items-center 
            flex-nowrap 
            min-w-full 
            divide-x 
            divide-solid 
            divide-gray-300 
            border-b 
            border-gray-300 
            bg-gray-200"
>
	{#each headers as header}
		<div
			class="py-2 grid place-items-center"
			style="min-width:{100 / headers.length}%;width:{header.width || 200}px"
		>
			{header.name}
		</div>
	{/each}
</div>
