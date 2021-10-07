<script>
	export let content = 'test';
	export let header = {};
	export let headersLength = 10;
</script>

<div
	class="p-2   flex-shrink-0 whitespace-nowrap overflow-ellipsis overflow-hidden"
	style="min-width:{100 / headersLength}%;width:{header.width || 200}px"
>
	{content}
</div>
