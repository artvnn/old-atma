const fs = require('fs');
const rmdir = require('rmdir');
const ncp = require('ncp');

let first = list =>
	list != null && list != undefined
		? list.length > 0
			? list[0]
			: null
		: null;

let rest = list => {
	list = list != null && list != undefined ? list : [];
	list.splice(0, 1);
	return list;
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
	clone: o => {
		return JSON.parse(JSON.stringify(o));
	},
	deepCopy: (source, target) => {
		return new Promise((resolve, reject) => {
			ncp(source, target, e => {
				e ? reject(e) : resolve();
			});
		});
	},
	first: first,
	rest: rest,
	second: list => first(rest(list))
};
