const utils = require("../../utils");
const path = require("path");
const fs = require("fs");
const first = utils.first;
const rest = utils.rest;
const second = utils.second;

module.exports = (inputPath, outputPath) => {
	return new Promise((resolve, reject) => {
		try {
			resolve();
		} catch (err) {
			reject(err);
		}
	});
};
