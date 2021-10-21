import { fuzzy } from 'fast-fuzzy'; //{ Searcher, fuzzy, search }
import * as fastSort from 'fast-sort';
import { writable } from 'svelte/store';
import lazy from 'lazy.js';
import { treeSearch } from './treeSearch';

export function tableController(data, headerConfig) {
	const TEST_PERF_AND_LOG = true;
	const bigTableData = data;
  // treeSearch
  let searchTrees = {}
  console.time('tree');
	bigTableData.forEach((v, i) =>
		Object.keys(v).map((k) => {
			if (k !== 'sentence') {
        searchTrees[k] = addToTree(tree[k], v[k], i)
      }
		}),
	);
	console.timeEnd('tree');
	console.log(bigTableData);

	let filterSearchSortConfig = { filter: {}, search: {}, sort: [] };

	const { subscribe: visibleData, update: updateVisibleData } = writable({});
	const { subscribe: headersConfig, update: updateHeadersConfig } = writable({});
	updateHeadersConfig(() => headerConfig || Object.keys(bigTableData[0]).map((h) => ({ name: h, key: h, width: 400 })));

	return {
		headersConfig,
		visibleData,
		sort: (key) => {
			if (TEST_PERF_AND_LOG) console.time('sort');
			let prevSort = { ...filterSearchSortConfig.sort };
			let lastSorted = Object.values(prevSort).length > 0 ? Math.max(...Object.values(prevSort).map((v) => v.order)) : 0;
			if (!(key in prevSort)) {
				prevSort[key] = { asc: (u) => u[key], order: lastSorted + 1 };
			} else if ('asc' in prevSort[key]) {
				prevSort[key] = { desc: (u) => u[key], order: prevSort[key].order };
			} else {
				delete prevSort[key];
			}
			const sortParams = fastSort.sort(Object.values(prevSort)).by([{ asc: (u) => u.order }]);
			updateVisibleData((prev) => fastSort.sort(prev).by(sortParams)); //[{ asc: (u) => u.firstName }, { desc: (u) => u.lastName }]
			filterSearchSortConfig = { ...filterSearchSortConfig, sort: prevSort };
			if (TEST_PERF_AND_LOG) console.timeEnd('sort');
		},
		search: () => {},
		// reset: () => {},
	};
}
