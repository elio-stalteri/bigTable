import App from './App.svelte';
import wasm from '../../bigTable/Cargo.toml';

const init = async () => {
    const bigTable = await wasm();


    const app = new App({
      target: document.body,
      props: {
        // https://svelte.dev/docs#Creating_a_component
        bigTable: bigTable,
      },
    });

};

init();
