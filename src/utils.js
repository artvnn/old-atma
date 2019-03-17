const fs = require("fs");
const rmdir = require("rmdir");
const ncp = require("ncp");

const isNil = item => item === null || item === undefined;
const isNotNil = item => !isNil(item);
const isList = item => item instanceof Array;

const clone = o => {
	return JSON.parse(JSON.stringify(o));
};

const first = list =>
	isNotNil(list) ? (list.length > 0 ? list[0] : null) : null;

const rest = list => {
	let newList = isNotNil(list) ? (isList(list) ? clone(list) : []) : [];
	newList.splice(0, 1);
	return newList;
};

module.exports = {
	rmdir: folder => {
		return new Promise((resolve, reject) => {
			if (fs.existsSync(folder)) {
				rmdir(folder, e => {
					e ? reject(e) : resolve();
				});
			} else {
				resolve();
			}
		});
	},
	clone: clone,
	deepCopy: (source, target) => {
		return new Promise((resolve, reject) => {
			ncp(source, target, e => {
				e ? reject(e) : resolve();
			});
		});
	},
	first: first,
	rest: rest,
	second: list => first(rest(list)),
	nth: (list, n) => (isNil(list) ? null : n < list.length ? list[n] : null),
	replaceAll: (str, s1, s2) => str.split(s1).join(s2),
	pipe: (...fns) => data => fns.reduce((acc, fn) => fn(acc), data),
	isList: isList,
};
