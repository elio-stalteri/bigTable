mod utils;

use js_sys::{Function, Object, Reflect, WebAssembly};
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



use std::collections::HashMap;
use std::sync::Mutex;

#[derive(Serialize, Deserialize)]
pub struct Row {
    pub data: Vec<String>,
    pub row: String,
}

//static mut TABLE: Mutex<HashMap<String, Row>> = Mutex::new(HashMap::new()); 


// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

static mut tableData: Vec<Vec<String>> = Vec::new();
static mut tableRows: Vec<String> = Vec::new();
static mut callback: Option<js_sys::Function> = None;
// f: &js_sys::Function
#[wasm_bindgen]
pub fn setData(array: JsValue ) {
    unsafe {
        tableData = array.into_serde().unwrap();
        // callback = Some(f); f: js_sys::Function
        // let this = JsValue::null();
        // let x = JsValue::from(5.);
        // callback.as_ref().unwrap().call1(&this, &x);
        // renderRowsArray(false,0.,0.);
        renderRowsArray();
    }
}

pub fn renderRowsArray() {
    unsafe{
        // if callCallback {
        //     console_log!("start {}",start);
        //     console_log!("end {}",end);
        // }
        tableRows = Vec::new();
        for (rowIdx, row) in tableData.iter().enumerate() {
            let mut rowString: String = "".to_string();
            for (cellIdx, cell) in row.iter().enumerate() {
                let resString: String = format!("<div><span>{}</span></div>", cell);
                rowString.push_str(&resString[..]);
            }
            // callCallback: bool,start: f64,end:f64
            // if callCallback  {
            //     // console_log!("rendering data {}",tableData[0][0]);
            //     let this = JsValue::null();
            //     let y = JsValue::from(rowIdx.to_string());
            //     // console_log!("rowIdx {}",rowIdx);
            //     if rowIdx >= (start as usize)  && rowIdx <= (end as usize){ 
            //         let x = JsValue::from(rowString.to_string());
            //         callback.as_ref().unwrap().call2(&this, &y,&x);
            //     }else{
            //         let x = JsValue::from(format!("<div class=\"row\" >loading... {}</div>",rowIdx).to_string());
            //         callback.as_ref().unwrap().call2(&this, &y,&x);
            //     }
            // }
            tableRows.push(rowString)
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
pub fn getNumberRows()-> JsValue {
    unsafe {
       return JsValue::from_serde(&tableRows.len()).unwrap()
    }
}

#[wasm_bindgen]
pub fn getRowsSlice(datajs: JsValue)-> JsValue {
    unsafe {
        let data: Vec<f64> = datajs.into_serde().unwrap();
        let start = data[0] as usize;
        let end = data[1] as usize;
        return JsValue::from_serde(&tableRows[start..=end].join("")).unwrap()
    }
}


// #[wasm_bindgen]
// pub fn reRender(datajs: JsValue) {
//     let data: Vec<f64> = datajs.into_serde().unwrap();
//     // console_log!("startIdx {}",data[0]);
//     // console_log!("endIdx {}",data[1]);
//     renderRowsArray(true,data[0],data[1]);
// }

