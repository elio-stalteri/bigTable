<script>
  import { onMount } from "svelte";
  import Row, { setData } from "./Row.svelte";
  export let bigTable;
  bigTable.setData(
    Array.apply(null, {
      length: Math.floor(Math.random() * 1000 + 200)
    }).map(() =>
      Array.apply(null, { length: 20 }).map(
        () => Math.floor(Math.random() * 100000) + "%"
      )
    ),
    setData
  );
  // console.log("getData", bigTable.getData());
  // console.log("getRows", bigTable.getRows());
  // let example = bigTable.send_example_to_js();
  // console.log("send_example_to_js", example);
  // bigTable.receive_example_from_js(example);

  let rows = bigTable.getRows();

  const cellH = 29
  const tableH = 388.5
  const numberVisible = Math.ceil(tableH/cellH)
  
  onMount(() => {
    console.log(numberVisible+10)
    bigTable.reRender([0,numberVisible+10]);
  });

  function tableScroll(e){
    const TableScrollY = e.target.scrollTop
    const cellOffset = Math.floor(TableScrollY/cellH)
    //console.log([cellOffset,cellOffset+numberVisible+10])
    bigTable.reRender([cellOffset,cellOffset+numberVisible+10]);
  }
</script>

<style>
  .wrapper {
    width: 80%;
    margin: auto;
    height: 50%;
    margin-top: 20%;
    overflow-y: hidden;
    overflow-x: hidden;
    padding: 5px;
    /* border:1px solid red; */
  }
  .table {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(20, minmax(80px, 1fr));
    /* gap: 10px; */
    overflow-y: scroll;
    overflow-x: scroll;
    /* border:1px solid teal */
    border: 1px solid rgba(0, 0, 0, 0.534);
  }
  .table > :global(div) {
    border-left: 1px solid rgba(0, 0, 0, 0.534);
    border-top: 1px solid rgba(0, 0, 0, 0.534);
    padding: 5px;
  }
  .table > :global(div.row) {
    grid-column:20
  }

  
</style>

<div class="wrapper">
  <div class="table" on:scroll={tableScroll}>
    {#each rows as row, i}
      <Row id={`${i}`} />
    {/each}
  </div>
</div>
