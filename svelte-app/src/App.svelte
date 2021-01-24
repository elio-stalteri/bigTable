<script>
  import { onMount } from "svelte";
  import initBigTable from "./bigTable";
  export let buffer = 40;
  let maxBuffer = 70;

  function unpack(str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      bytes.push(char >>> 8);
      bytes.push(char & 0xff);
    }
    return bytes;
  }
  // console.log("getData", bigTable.getData());
  // console.log("getRows", bigTable.getRows());
  // let example = bigTable.send_example_to_js();
  // console.log("send_example_to_js", example);
  // bigTable.receive_example_from_js(example);

  const cellH = 29;
  const tableH = 388.5;
  const numberVisible = Math.ceil(tableH / cellH);
  let data = false;

  let rows = false;
  let paddingB = 0;
  let numberOfRows = 0;
  let paddingT = 0;
  let bigTable;

  onMount(async () => {
    console.log(numberVisible + 10);
    // bigTable.reRender([0,numberVisible+10]);
    const res = await fetch("testData.json");
    const tmpData = await res.json();
    // data = Array.apply(null, {
    //   length: Math.floor(Math.random() * 100 + 100)
    // }).map((v, i) => Array.apply(null, { length: 20 }).map(() => i + "%"));
    bigTable = await initBigTable();
    let startSlice = 0;
    const sliceLength = buffer*10;
    bigTable.setData(tmpData.slice(startSlice, sliceLength));
    const loadDataAsync = async (tmpData,startSlice,sliceLength,numberOfTimes) => {
      startSlice +=sliceLength;
      console.log("loadDataAsync", tmpData.slice(startSlice, startSlice+sliceLength>tmpData.length-1?undefined:startSlice+sliceLength).length)
      bigTable.addData(tmpData.slice(startSlice, startSlice+sliceLength>tmpData.length-1?undefined:startSlice+sliceLength));
      numberOfRows = bigTable.getNumberRows();
      console.log("numberOfRows",numberOfRows,numberOfTimes % 4 ===0)
      if(startSlice+sliceLength<tmpData.length-1){
        setTimeout(()=>loadDataAsync(tmpData,startSlice,sliceLength,numberOfTimes+1),200)
      }else{

      }
    };
    loadDataAsync(tmpData,startSlice,sliceLength,1)
    data = tmpData;
    console.log(bigTable, data);
  });
  $: if (data && bigTable) {
    console.log("started");
    const tStart = performance.now();
    console.log("time to load the data into rust", performance.now() - tStart);
    rows = bigTable.getRowsSlice([0, numberVisible + 10]);
    paddingB = (bigTable.getNumberRows() - numberVisible) * cellH;
    numberOfRows = bigTable.getNumberRows();
    console.log("numberOfRows", numberOfRows);
  }

  let prevoius_scroll_pos;
  function calculateBufferSize(scroll_pos) {
    if (!prevoius_scroll_pos) {
      prevoius_scroll_pos = scroll_pos;
      return buffer;
    }
    const addToBuffer = Math.floor(
      Math.abs(scroll_pos - prevoius_scroll_pos) / cellH
    );
    console.log("calculateBufferSize", addToBuffer);
    prevoius_scroll_pos = scroll_pos;
    return buffer + addToBuffer > maxBuffer ? maxBuffer : buffer + addToBuffer;
  }

  let isUpdating = false;
  function tableScroll(e) {
    if (!isUpdating) {
      isUpdating = true;
      const TableScrollY = e.target.scrollTop;
      const dynamicBuffer = calculateBufferSize(TableScrollY);
      let cellOffset = Math.floor(TableScrollY / cellH);
      if (cellOffset < dynamicBuffer) {
        cellOffset = 0;
      } else {
        cellOffset = cellOffset - dynamicBuffer;
      }
      let lastCellToRender = cellOffset + numberVisible + 2 * dynamicBuffer;
      if (lastCellToRender >= numberOfRows - 1) {
        lastCellToRender = numberOfRows - 1;
      }

      paddingT = cellOffset * cellH;
      paddingB = (numberOfRows - lastCellToRender - 1) * cellH;
      rows = bigTable.getRowsSlice([cellOffset, lastCellToRender]);
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
    overflow-x: scroll;
    padding: 5px;
    /* border:1px solid red; */
  }
  .table {
    width: fit-content;
    display: grid;
    grid-template-columns: repeat(20, minmax(80px, 1fr));
    /* gap: 10px; */
    overflow-y: hidden;
    overflow-x: hidden;
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
    {@html rows}
  </div>
</div>
