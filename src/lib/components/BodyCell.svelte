<script>
	export let content = 'test';
	export let header = {};
	export let headersLength = 10;
</script>

<div
	class="py-2 grid place-items-center  flex-shrink-0"
	style="min-width:{100 / headersLength}%;width:{header.width || 200}px"
>
	{content}
</div>
