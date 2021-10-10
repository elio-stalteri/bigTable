<script>
	import BigTable from '$lib/index';
	import { onMount } from 'svelte';

	const AMMOUNT = 1_000_000;
	const REFRESH_EVERY = 10;

	onMount(() => {
		const faker = window.Faker;
		console.log(faker);
		const array = [];

		let tmpValue = null;
		for (let i = 0; i < AMMOUNT; ++i) {
			if (tmpValue === null || i % REFRESH_EVERY === 0) {
				// console.log(i);
				tmpValue = {
					firstName: faker.Name.firstName(),
					lastName: faker.Name.lastName(),
					email: faker.Internet.email(),
					sentence: faker.Lorem.sentence(),
					phoneNumbe: faker.PhoneNumber.phoneNumber()
				};
			}
			array[i] = {...tmpValue};
		}
		BigTable.controller.initTable(array);
		BigTable.controller.sort('firstName');
		setTimeout(() => {
			BigTable.controller.sort('lastName');
		}, 5000);
		setTimeout(() => {
			BigTable.controller.sort('firstName');
		}, 10000);
		setTimeout(() => {
			BigTable.controller.sort('firstName');
		}, 15000);
		setTimeout(() => {
			BigTable.controller.sort('firstName');
		}, 20000);
		// setTimeout(
		// 	()=>{

		// 		BigTable.controller.search("Zachary")
		// 	},
		// 	1000
		// )

		// setTimeout(
		// 	()=>{

		// 		BigTable.controller.search("kkkak")
		// 	},
		// 	3000
		// )

		// const dataframe = new df.DataFrame(data)
		// data = data.filter((a) => a.test > 10000);

	});
</script>

<div class="absolute inset-8 ">
	<!-- <BigTable {data} /> -->
	<svelte:component this={BigTable.component} />
</div>
