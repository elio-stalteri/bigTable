export const treeSearch = (maxErrors = 2) => {
	const tree = {};
	const MAX_ERRORS = maxErrors;

	const addToTree = (word, index) => {
		const wordArr = Array.from(word);
		const tmpTree = tree || {};
		var tmp = tmpTree;
		for (let i = 0; i < wordArr.length; i++) {
			const isLast = i === wordArr.length - 1;
			const ch = wordArr[i];
			if (!(ch in tmp)) {
				if (isLast) {
					tmp[ch] = {
						__indexes__: [{ index, word }],
					};
				} else {
					tmp[ch] = {};
				}
			} else {
				if (isLast) {
					tmp[ch] = {
						__indexes__: [...(tmp[ch].__indexes__ || []), { index, word }],
					};
				}
			}
			tmp = tmp[ch];
		}
		return tmpTree;
	};

	const getTreeTails = (remaining = tree) => {
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

	const searchIntoTheTree = (word, tmpTree = tree, failed = 0) => {
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
			} else if (failed < MAX_ERRORS) {
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

	return {
		tree,
		addToTree,
		getTreeTails,
		searchIntoTheTree,
	};
};
