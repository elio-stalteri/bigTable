import { fuzzy } from "fast-fuzzy"; //{ Searcher, fuzzy, search }
import * as fastSort from 'fast-sort';
import { writable } from "svelte/store";
import lazy from "lazy.js"

function filterLargeArray(array, filterFn, onProgress, onDone) {
    const tmpResult = [];
    const arrayLength = array.length
    let chunk = 1000;
    let index = 0;
    let stop = false;
    function doChunk() {
        var cnt = chunk;
        while (cnt-- && index < array.length) {
            if (filterFn(array[index])) tmpResult.push(array[index])
            ++index;
        }
        if (index < array.length) {
            if (onProgress((index + 1) / arrayLength, [...tmpResult]) === "STOP") {
                return;
            }
            if (!stop) setTimeout(doChunk, 1);
        } else {
            onDone(tmpResult)
        }
    }
    doChunk();
    return () => { stop = true }
}


const TEST_PERF_AND_LOG = true

const bigTableData = writable([])

export const visibleData = writable([])
export const bigTableHeaderConfig = writable([])
export const filterSearchSortConfig = writable({ filter: {}, search: {}, sort: [] })

bigTableData.subscribe((value) => {
    visibleData.set(value)
    if (value.length > 0) {
        bigTableHeaderConfig.update(prev => prev && prev.length > 0 ? prev : Object.keys(value[0]).map((h) => ({ name: h, key: h, width: 400 })))
        filterSearchSortConfig.set({ filter: {}, search: {}, sort: [] })
    }
})

filterSearchSortConfig.subscribe((value) => {
    if (Object.keys(value.sort).length > 0) {
        if (TEST_PERF_AND_LOG) {
            console.time("sort")
        }
        const sortParams = fastSort.sort(Object.values(value.sort)).by([{ asc: (u) => u.order }])
        visibleData.update((prev) => fastSort.sort(prev).by(sortParams));//[{ asc: (u) => u.firstName }, { desc: (u) => u.lastName }]
        if (TEST_PERF_AND_LOG) {
            console.timeEnd("sort")
        }
    } else {
        bigTableData.subscribe(data => visibleData.set(data))();
    }
})

let searchKeys = []

bigTableHeaderConfig.subscribe(value => {
    searchKeys = value && value.length > 0 ? value.map(v => v.key) : []
})

if (TEST_PERF_AND_LOG) {
    bigTableData.subscribe(v => {
        console.groupCollapsed("bigTableData")
        console.log(v)
        console.groupEnd("bigTableData")
    })
    visibleData.subscribe(v => {
        console.groupCollapsed("visibleData")
        console.log(v)
        console.groupEnd("visibleData")
    })
    bigTableHeaderConfig.subscribe(v => {
        console.groupCollapsed("bigTableHeaderConfig")
        console.log(v)
        console.groupEnd("bigTableHeaderConfig")
    })
    filterSearchSortConfig.subscribe(v => {
        console.groupCollapsed("filterSearchSortConfig")
        console.log(v)
        console.groupEnd("filterSearchSortConfig")
    })
}





export const initTable = (data, headerConfig) => {
    bigTableHeaderConfig.set(headerConfig)
    bigTableData.set(data)
}


let stopSearch = () => { }
export const search = (value) => {
    stopSearch()
    console.log("new search", visibleData)
    if (TEST_PERF_AND_LOG) {
        console.time("search")
    }
    // visibleData.update((prev) => filter(prev, (a) => searchKeys.some(key => fuzzy(value, a[key]) > 0.85)));
    // visibleData.update((prev) => lazy(prev)
    //     .filter((a) => searchKeys.some(key => fuzzy(value, a[key]) > 0.85))
    //     .take(10)
    //     .toArray()
    // );
    visibleData.update((prev) => {
        stopSearch = filterLargeArray(
            prev,
            (a) => searchKeys.some(key => fuzzy(value, a[key]) > 0.85),
            (progress, newV) => {
                if (parseInt(progress * 100) % 5 === 0) console.log(progress, newV)
                if (newV.length > 10) {
                    visibleData.set(newV)
                    if (TEST_PERF_AND_LOG) {
                        console.timeEnd("search")
                    }
                    return "STOP"
                }
            },
            (newV) => {
                visibleData.set(newV)
                if (TEST_PERF_AND_LOG) {
                    console.timeEnd("search")
                }
            })
        return prev
    })
}

export const sort = (key) => {

    filterSearchSortConfig.update(prev => {
        let prevSort = { ...prev.sort }
        let lastSorted = Object.values(prevSort).length > 0 ? Math.max(...Object.values(prevSort).map(v => v.order)) : 0
        if (!(key in prevSort)) {
            prevSort[key] = { asc: (u) => u[key], order: lastSorted + 1 }
        } else if ("asc" in prevSort[key]) {
            prevSort[key] = { desc: (u) => u[key], order: prevSort[key].order }
        } else {
            delete prevSort[key]
        }

        return { ...prev, sort: prevSort }
    })

}

