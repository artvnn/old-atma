const utils = require('../utils');
const assert = require('chai').assert;
const expect = require('chai').expect;
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const rmdir = utils.rmdir;
const clone = utils.clone;
const first = utils.first
const rest = utils.rest;
const second = utils.second;

module.exports = (inputPath, outputPath) => {

	let translate = ast => {
		let codeLines = [];
		let fn = first(ast);
		switch(fn) {
			case 'app':
				codeLines = rest(ast).map(translate);
				break;
			case 'let':
				codeLines.push(`let ${second(ast)} = ${dataType(rest(ast))};`);
				break;
			default:
				throw new Error('Invalid element: ' + fn + ', ast: ' + JSON.stringify(ast));
		};
		return codeLines;
	};

	let dataType = ast => {
		let type = first(ast);
		var val = '';
		switch(type) {
			case 'String':
				val = `'${second(ast)}'`;
				break;
			case 'Date':
				val = `new Date('${second(ast)}')`;
				break;
			case 'List':
				val = `[${rest((second(ast))).join(', ')}]`;
				break;
			default:
				val = second(ast);
				break;
		}
		return val;
	};

	return new Promise((resolve, reject) => {
		try {
			let ast = JSON.parse(fs.readFileSync(
				path.join(inputPath, 'main.json'),
				'utf8'
			));
			let codeLines = translate(ast);
			fs.writeFileSync(
				path.join(outputPath, 'main.js'),
				codeLines.join('\n')
			);
			resolve();
		} catch (err) {
			reject(err);
		}
	});

};
