<script>
  import { onMount } from "svelte";
  import Row, { setData } from "./Row.svelte";
  export let bigTable;
  bigTable.setData(
    Array.apply(null, {
      length: Math.floor(Math.random() * 100 + 20000)
    }).map((v, i) => Array.apply(null, { length: 20 }).map(() => i + "%")),
    setData
  );
  // console.log("getData", bigTable.getData());
  // console.log("getRows", bigTable.getRows());
  // let example = bigTable.send_example_to_js();
  // console.log("send_example_to_js", example);
  // bigTable.receive_example_from_js(example);

  const cellH = 29;
  const tableH = 388.5;
  const numberVisible = Math.ceil(tableH / cellH);

  let rows = bigTable.getRowsSlice([0, numberVisible + 10]);

  onMount(() => {
    console.log(numberVisible + 10);
    // bigTable.reRender([0,numberVisible+10]);
  });
  let isUpdating = false;

  let paddingT = 0;
  let paddingB = (bigTable.getNumberRows() - numberVisible + 10) * cellH;
  const numberOfRows = bigTable.getNumberRows();
  console.log("numberOfRows",numberOfRows)
  function tableScroll(e) {
    if (!isUpdating) {
      isUpdating = true;
      const TableScrollY = e.target.scrollTop;
      const cellOffset = Math.floor(TableScrollY / cellH);
      console.log([cellOffset, cellOffset + numberVisible]);
      paddingT = cellOffset * cellH;
      paddingB =
        (numberOfRows - numberVisible - cellOffset -1) * cellH;
      rows = bigTable.getRowsSlice([
        cellOffset,
        cellOffset + numberVisible < numberOfRows
          ? cellOffset + numberVisible 
          : numberOfRows - 1
      ]);
      isUpdating = false;
    }
  }
</script>

<style>
  .wrapper {
    width: 80%;
    margin: auto;
    height: 50%;
    margin-top: 20%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 5px;
    /* border:1px solid red; */
  }
  .table {
    width: 100%;
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
    grid-column: 1 / span 20;
    height: 29px;
    background: rgb(201, 56, 56);
    border-top: 1px solid black;
  }
</style>

<div class="wrapper" on:scroll={tableScroll}>
  <div
    class="table"
    style="padding-top:{paddingT}px;padding-bottom:{paddingB}px;">
    {#each rows as row, i}
      {@html row}
    {/each}
  </div>
</div>
