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
    data[id] = content => {
      console.log(id)
      row = content;
    };
  })
</script>

{@html row}
