<script>
	import Header from './components/Header.svelte';
	import Body from './components/Body.svelte';
	export let data = new Array(900_000).fill({
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
	}).map((v,i)=>({...v,test:v.test+i}));
	export let headers = Object.keys(data[0]).map(h=>({name:h,key:h,width:200}));

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
