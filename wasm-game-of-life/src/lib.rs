mod utils;

use wasm_bindgen::prelude::*;

// #[wasm_bindgen(start)]
// pub fn run() {
//     bare_bones();
//     using_a_macro();
//     using_web_sys();
// }

// First up let's take a look of binding `console.log` manually, without the
// help of `web_sys`. Here we're writing the `#[wasm_bindgen]` annotations
// manually ourselves, and the correctness of our program relies on the
// correctness of these annotations!

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

// Next let's define a macro that's like `println!`, only it works for
// `console.log`. Note that `println!` doesn't actually work on the wasm target
// because the standard library currently just eats all output. To get
// `println!`-like behavior in your app you'll likely want a macro like this.

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Example {
    pub field1: Vec<f32>,
    pub field2: Vec<Vec<f32>>,
    pub field3: [f32; 4],
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

static mut tableData: Vec<Vec<String>> = Vec::new();
static mut tableRows: Vec<String> = Vec::new();

#[wasm_bindgen]
pub fn setData(array: JsValue) {
    unsafe {
        tableData = array.into_serde().unwrap();
        renderRowsArray();
    }
}

pub fn renderRowsArray() {
    unsafe{
        tableRows = Vec::new();
        for row in tableData.iter() {
            let mut rowString: String = "".to_string();
            for cell in row.iter() {
                let resString: String = format!("<div><span>{}</span></div>", cell);
                rowString.push_str(&resString[..]);
            }
            tableRows.push(rowString.to_string())
        }
    }
}

#[wasm_bindgen]
pub fn getData()-> JsValue {
    unsafe {
       return JsValue::from_serde(&tableData).unwrap()
    }
}

#[wasm_bindgen]
pub fn getRows()-> JsValue {
    unsafe {
       return JsValue::from_serde(&tableRows).unwrap()
    }
}

#[wasm_bindgen]
pub fn send_example_to_js() -> JsValue {
    
    let example = Example {
        field1:vec![43.],
        field2: vec![vec![1., 2.], vec![3., 4.]],
        field3: [1., 2., 3., 4.]
    };

    JsValue::from_serde(&example).unwrap()
}


#[wasm_bindgen]
pub fn receive_example_from_js(val: &JsValue) {
    let example: Example = val.into_serde().unwrap();
    console_log!("test example {}",example.field1[0]);
}

