const utils = require('../utils');
const assert = require('chai').assert;
const expect = require('chai').expect;
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const rmdir = utils.rmdir;
const clone = utils.clone;
const js = require('./js');

require('../test_setup.js');

describe('Javascript Translator', () => {
	let testPath;
	before(() => {
		testPath = path.join(__dirname, 'test_js');
		mkdirp.sync(testPath);
	});
	it('should translate constant declarations', () => {
		let inputPath = path.join(testPath, 'input');
		mkdirp.sync(inputPath);
		let outputPath = path.join(testPath, 'output');
		mkdirp.sync(outputPath);
		fs.writeFileSync(
			path.join(inputPath, 'main.json'),
			JSON.stringify([
				'app',
				['let', 'b1', 'Bool', 'true'],
				['let', 'b2', 'Bool', 'false'],
				['let', 'i1', 'Int', '123'],
				['let', 'i2', 'Int', '1234567890'],
				['let', 's1', 'String', 'Manoj'],
				['let', 's2', 'String', 'Kumar'],
				['let', 'f1', 'Float', '1.23'],
				['let', 'f2', 'Float', '1234.5678'],
				['let', 'd1', 'Date', '2018/07/17'],
				['let', 'l1', 'List', ['`', '1', '2', '3']]
			])
		);
		return js(inputPath, outputPath).then(() => {
			let fileData = fs.readFileSync(path.join(outputPath, 'main.js'), { encoding: 'utf8' });
			expect(fileData).to.equal(
				`let b1 = true;
let b2 = false;
let i1 = 123;
let i2 = 1234567890;
let s1 = 'Manoj';
let s2 = 'Kumar';
let f1 = 1.23;
let f2 = 1234.5678;
let d1 = new Date('2018/07/17');
let l1 = [1, 2, 3];`
			);
		});
	});
	after(() => {
		// rmdir(testPath);
	});
});
