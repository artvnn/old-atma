const utils = require('../utils');
const deepCopy = utils.deepCopy;

module.exports = (inputPath, outputPath) => {
	return new Promise((resolve, reject) => {
		deepCopy(inputPath, outputPath).then(
			() => {
				resolve();
			},
			e => {
				reject(e);
			}
		);
	});
};
