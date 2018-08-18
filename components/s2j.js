const utils = require('../utils');
const assert = require('chai').assert;
const expect = require('chai').expect;
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const rmdir = utils.rmdir;
const clone = utils.clone;
const tmParser = require('tm-parser');

module.exports = (inputPath, outputPath) => {
	const prefix = '<<embedFile:';
	const suffix = '>>';

	return new Promise((resolve, reject) => {
		try {
			let tmFile = fs.readFileSync(
				path.join(inputPath, 'main.tm'),
				'utf8'
			);
			tmFile = embedFiles(tmFile);
			fs.writeFileSync(path.join(inputPath, 'main_embedded.tm'), tmFile);
			fs.writeFileSync(
				path.join(outputPath, 'main.json'),
				JSON.stringify(tmParser.parse(tmFile)[0], null, 2)
			);
			resolve();
		} catch (err) {
			reject(err);
		}

		function embedFiles(data) {
			let segments = data.split(prefix);
			if (segments.length > 1) {
				let embedFilename = segments[1].split(suffix)[0];
				let filePath = path.join(inputPath, embedFilename + '.tm');
				let embedData = fs.readFileSync(filePath, 'utf8');
				let result =
					segments[0] +
					embedData +
					data.substr(
						segments[0].length +
							prefix.length +
							embedFilename.length +
							suffix.length
					);
				return embedFiles(result);
			} else return data;
		}
	});
};
