import { fuzzy } from 'fast-fuzzy'; //{ Searcher, fuzzy, search }
import * as fastSort from 'fast-sort';
import { writable } from 'svelte/store';
import lazy from 'lazy.js';

function filterLargeArray(array, filterFn, onProgress, onDone) {
	const tmpResult = [];
	const arrayLength = array.length;
	let chunk = 1000;
	let index = 0;
	let stop = false;
	function doChunk() {
		var cnt = chunk;
		while (cnt-- && index < array.length) {
			if (filterFn(array[index])) tmpResult.push(array[index]);
			++index;
		}
		if (index < array.length) {
			if (onProgress((index + 1) / arrayLength, [...tmpResult]) === 'STOP') {
				return;
			}
			if (!stop) requestAnimationFrame(doChunk);
		} else {
			onDone(tmpResult);
		}
	}
	doChunk();
	return () => {
		stop = true;
	};
}

const asyncFilter = async (arr, predicate, onSuccess) => {
	Promise.all(arr.map(predicate)).then((res) => {
		onSuccess(arr.filter((_, i) => res[i]));
	});
};

const TEST_PERF_AND_LOG = true;

const bigTableData = writable([]);

export const visibleData = writable([]);
export const bigTableHeaderConfig = writable([]);
export const filterSearchSortConfig = writable({ filter: {}, search: {}, sort: [] });
export const loadingOverlay = writable({ enabled: false, text: '' });
export const refreshTableHeight = writable(false);
export const refreshTableHeightTrigger = () => refreshTableHeight.update((v) => !v);

export const searchProgress = writable(0);

function setLoadingOverlay(text) {
	loadingOverlay.update(() => ({ enabled: true, text: text || '' }));
}
function unsetLoadingOverlay() {
	loadingOverlay.update(() => ({ enabled: false, text: '' }));
}

const tree = {};

const addToTree = (currTree, word, index) => {
	const wordArr = Array.from(word);
	const tmpTree = currTree || {};
	var tmp = tmpTree;
	for (let i = 0; i < wordArr.length; i++) {
		const isLast = i === wordArr.length - 1;
		const ch = wordArr[i];
		if (!(ch in tmp)) {
			if (isLast) {
				tmp[ch] = {
					__indexes__: [index],
				};
			} else {
				tmp[ch] = {};
			}
		} else {
			if (isLast) {
				tmp[ch] = {
					__indexes__: [...(tmp[ch].__indexes__ || []), index],
				};
			}
		}
		tmp = tmp[ch];
	}
	return tmpTree;
};

const getTreeTails = (remaining) => {
	let res = [];
	if ('__indexes__' in remaining) {
		return remaining.__indexes__;
	} else
		for (var key in remaining) {
			if (!('__indexes__' in remaining[key])) {
				res = res.concat(getTreeTails(remaining[key]));
			} else {
				res = res.concat(remaining[key].__indexes__);
			}
		}
	return res;
};

const searchIntoTheTree = (tmpTree, word, failed = 0) => {
	const wordArr = Array.from(word);
	var tmp = tmpTree;
	for (let i = 0; i < wordArr.length; i++) {
		const isLast = i === wordArr.length - 1;
		const ch = wordArr[i];
		if (ch in tmp) {
			tmp = tmp[ch];
			if (isLast) {
				if ('__indexes__' in tmp) {
					return tmp.__indexes__ || [];
				} else {
					return getTreeTails(tmp);
				}
			}
		} else if (!failed < 5) {
			let res = [];
			// console.log('fixed word', ch, wordArr.slice(i + 1).join(''));
			for (var key in tmp) {
				if (key !== '__indexes__') res = res.concat(searchIntoTheTree(tmp[key], wordArr.slice(i + 1).join(''), failed + 1));
			}
			return res;
		}
	}
	return [];
};

bigTableData.subscribe((value) => {
	console.time('tree');
	value.forEach((v, i) =>
		Object.keys(v).map((k) => {
			tree[k] = addToTree(tree[k], v[k], i);
		}),
	);
	console.timeEnd('tree');
	console.log(tree);
	// Aaliyah
	if ('sentence' in tree) {
		console.time('searchtree');

		const res = searchIntoTheTree(tree['sentence'], 'alituid cotsettetur dicta mon');
		console.log(
			'search res',
			res.map((i) => value[i]),
		);
		console.timeEnd('searchtree');
	}

	// visibleData.set(value);
	if (value.length > 0) {
		bigTableHeaderConfig.update((prev) => (prev && prev.length > 0 ? prev : Object.keys(value[0]).map((h) => ({ name: h, key: h, width: 400 }))));
		filterSearchSortConfig.set({ filter: {}, search: {}, sort: [] });
	}
});

filterSearchSortConfig.subscribe((value) => {
	if (Object.keys(value.sort).length > 0) {
		if (TEST_PERF_AND_LOG) {
			console.time('sort');
		}
		setLoadingOverlay('sorting...');
		setTimeout(() => {
			const sortParams = fastSort.sort(Object.values(value.sort)).by([{ asc: (u) => u.order }]);
			visibleData.update((prev) => fastSort.sort(prev).by(sortParams)); //[{ asc: (u) => u.firstName }, { desc: (u) => u.lastName }]
			unsetLoadingOverlay();
			if (TEST_PERF_AND_LOG) {
				console.timeEnd('sort');
			}
		}, 1);
	} else {
		setLoadingOverlay('loading data...');
		setTimeout(() => {
			bigTableData.subscribe((data) => {
				visibleData.update(() => data);
				unsetLoadingOverlay();
			})();
		}, 1);
	}
});

let searchKeys = [];

bigTableHeaderConfig.subscribe((value) => {
	searchKeys = value && value.length > 0 ? value.map((v) => v.key) : [];
});

if (TEST_PERF_AND_LOG) {
	bigTableData.subscribe((v) => {
		console.groupCollapsed('bigTableData');
		console.log(v);
		console.groupEnd('bigTableData');
	});
	visibleData.subscribe((v) => {
		console.groupCollapsed('visibleData');
		console.log(v);
		console.groupEnd('visibleData');
	});
	bigTableHeaderConfig.subscribe((v) => {
		console.groupCollapsed('bigTableHeaderConfig');
		console.log(v);
		console.groupEnd('bigTableHeaderConfig');
	});
	filterSearchSortConfig.subscribe((v) => {
		console.groupCollapsed('filterSearchSortConfig');
		console.log(v);
		console.groupEnd('filterSearchSortConfig');
	});
}

export const initTable = (data, headerConfig) => {
	bigTableHeaderConfig.set(headerConfig);
	bigTableData.set(data);
};

let stopSearch = () => {};
export const search = (value) => {
	stopSearch();
	console.log('new search', value);
	if (TEST_PERF_AND_LOG) {
		console.time('search');
	}
	// visibleData.update((prev) => filter(prev, (a) => searchKeys.some(key => fuzzy(value, a[key]) > 0.85)));
	// visibleData.update((prev) => lazy(prev)
	//     .filter((a) => searchKeys.some(key => fuzzy(value, a[key]) > 0.85))
	//     .take(10)
	//     .toArray()
	// );
	if (value === '') {
		setTimeout(() => {
			bigTableData.subscribe((data) => {
				visibleData.update(() => data);
				unsetLoadingOverlay();
			})();
		}, 1);
	} else
		visibleData.update((prev) => {
			const res = prev.filter((a, i) => {
				// console.log('filter', i);
				// searchProgress.update(() => (((i + 1) / prev.length) * 100).toFixed(10));
				return fuzzy(value, a.firstName) > 0.85;
			});
			console.timeEnd('search');
			return res;
		});
	visibleData.subscribe((prev) => {
		// asyncFilter(
		// 	prev,
		// 	async (a, i) => {
		// 		console.log('filter', i);
		// 		return searchKeys.some((key) => fuzzy(value, a[key]) > 0.85);
		// 	},
		// 	(res) => {
		// 				console.timeEnd('search');
		// 		visibleData.update(() => res);
		// 	},
		// );
		// stopSearch = filterLargeArray(
		// 	prev,
		// 	// (a) => searchKeys.some((key) => fuzzy(value, a[key]) > 0.85),
		// 	(a) => searchKeys.some((key) => a[key].indexOf(value) > -1),
		// 	(progress, newV) => {
		// 		console.log(progress);
		// 		searchProgress.update(() => (progress * 100).toFixed(10));
		// 		// if(prev.length!==newV.length) visibleData.update(() => newV);
		// 		// if (newV.length > 10) {
		// 		// 	searchProgress.update(() => 0);
		// 		// 	visibleData.update(() => newV);
		// 		// 	if (TEST_PERF_AND_LOG) {
		// 		// 		console.timeEnd('search');
		// 		// 	}
		// 		// 	return 'STOP';
		// 		// }
		// 	},
		// 	(newV) => {
		// 		visibleData.update(() => newV);
		// 		if (TEST_PERF_AND_LOG) {
		// 			console.timeEnd('search');
		// 		}
		// 	},
		// );
	})();
};

export const sort = (key) => {
	filterSearchSortConfig.update((prev) => {
		let prevSort = { ...prev.sort };
		let lastSorted = Object.values(prevSort).length > 0 ? Math.max(...Object.values(prevSort).map((v) => v.order)) : 0;
		if (!(key in prevSort)) {
			prevSort[key] = { asc: (u) => u[key], order: lastSorted + 1 };
		} else if ('asc' in prevSort[key]) {
			prevSort[key] = { desc: (u) => u[key], order: prevSort[key].order };
		} else {
			delete prevSort[key];
		}

		return { ...prev, sort: prevSort };
	});
};
