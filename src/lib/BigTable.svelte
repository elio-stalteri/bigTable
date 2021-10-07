<script>
	import Header from './components/Header.svelte';
	import Body from './components/Body.svelte';
	import { sort, createNewSortInstance } from 'fast-sort';
	import { Searcher, fuzzy, search } from 'fast-fuzzy';
	console.log(fuzzy);
	import { onMount } from 'svelte';
	export let data = new Array(20)
		.fill({
			test: 'wooow ',
			test2: 'wooowowo',
			test2: 'wooowowo',
			test3: 'wooowowo',
			test4: 'wooowowo',
			test5: 'wooowowo',
			test6: 'wooowowo',
			test7: 'wooowowo',
			test8: 'wooowowo',
			test9: 'wooowowo',
			test10: 'wooowowo',
			test11: 'wooowowo',
			test12: 'wooowowo',
			test13: 'wooowowo'
		})
		.map((v, i) => ({ ...v, test: i }));

	export let predefinedHeaders = null;
	$: headers =
		data.length > 0 ? Object.keys(data[0]).map((h) => ({ name: h, key: h, width: 400 })) : [];
	onMount(() => {
		setTimeout(() => {
			const t0 = performance.now();
			data = sort(data).by([{ asc: (u) => u.firstName }, { desc: (u) => u.lastName }]);
			const t1 = performance.now();
			console.log('sort time', t1 - t0);
		}, 30000);
		setTimeout(() => {
			console.log('filter start');
			const t0 = performance.now();
			data = data.filter((a, i) => fuzzy('Aalayah', a.firstName) > 0.85);
			const t1 = performance.now();
			console.log('filter time', t1 - t0);
		}, 50000);
	});
	let scrollLeft = 0;
</script>

<div
	class="
        relative 
        flex 
        w-full 
        h-full 
        overflow-x-hidden 
        overflow-y-hidden 
        items-start 
        flex-nowrap 
        flex-col 
        bg-gray-100 
        border
        rounded
        border-gray-300
        scrollbar-thumb-gray-400 
        scrollbar-track-gray-200"
>
	<Header {scrollLeft} {headers} />
	<Body bind:scrollLeft {headers} {data} />
</div>
