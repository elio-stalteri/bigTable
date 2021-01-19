<script>
  export let bigTable;
  const tableData = Array.apply(null, {
    length: Math.floor(Math.random() * 1000 + 200)
  }).map(() =>
    Array.apply(null, { length: 20}).map(
      () => Math.floor(Math.random()*100) + "%"
    )
  );
  bigTable.setData(tableData);
  console.log("getData", bigTable.getData());
  console.log("getRows", bigTable.getRows());
  let example = bigTable.send_example_to_js();
  console.log("send_example_to_js", example);
  bigTable.receive_example_from_js(example);
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>test!</h1>
  <p>
    Visit the
    <a href="https://svelte.dev/tutorial">Svelte tutorial</a>
    to learn how to build Svelte apps.
  </p>
</main>
