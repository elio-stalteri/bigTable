<script>
	import BigTable from '$lib/BigTable.svelte';
import { onMount } from 'svelte';
	// import BigTableDesign from '$lib/bigTableDesign.svelte';
	let data = []
	onMount(() => {
		const faker = window.Faker;
		console.log(faker)
		const array = [];
		
		const tt0 = performance.now();
		for (let i = 0; i < 3_000_000; ++i) {
			if(i%1000===0)console.log(i)
			array[i] = {
				firstName: faker.Name.firstName(),
				lastName: faker.Name.lastName(),
				email: faker.Internet.email(),
				sentence: faker.Lorem.sentence(),
				phoneNumbe: faker.PhoneNumber.phoneNumber()
			};
		}
		const tt1 = performance.now();
		data = array


		// const dataframe = new df.DataFrame(data)
		// data = data.filter((a) => a.test > 10000);

		console.log(tt1 - tt0);
	});
</script>


<div class="absolute inset-8 ">
    <BigTable {data} />
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