<script context="module">
  let data = {};
  export function setData(id, row) {
    if (data[id]) data[id](row);
  }
</script>

<script>
  import {onMount} from "svelte";
  export let id;
  let row = "";
  onMount(()=>{
    // console.log(id)
    data[id] = content => {
      row = content;
    };
  })
</script>

{@html row}
