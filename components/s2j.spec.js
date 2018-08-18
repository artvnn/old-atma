const utils = require('../utils');
const assert = require('chai').assert;
const expect = require('chai').expect;
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const rmdir = utils.rmdir;
const clone = utils.clone;
const s2j = require('./s2j');

require('../test_setup.js');

describe('S-Expression to JSON convertor: ', () => {
	let testPath;
	before(() => {
		testPath = path.join(__dirname, 'test_s2j');
		mkdirp.sync(testPath);
	});
	it('should parse a single file', () => {
		let inputPath = path.join(testPath, 'input');
		mkdirp.sync(inputPath);
		let outputPath = path.join(testPath, 'output');
		mkdirp.sync(outputPath);
		fs.writeFileSync(path.join(inputPath, 'main.tm'), '(a (b (c)))');
		return s2j(inputPath, outputPath).then(() => {
			let fileData = fs.readFileSync(path.join(outputPath, 'main.json'));
			expect(JSON.stringify(JSON.parse(fileData))).to.equal(
				JSON.stringify(['a', ['b', ['c']]])
			);
		});
	});
	it('should embed files before parsing', () => {
		let inputPath = path.join(testPath, 'input');
		mkdirp.sync(inputPath);
		let outputPath = path.join(testPath, 'output');
		mkdirp.sync(outputPath);
		fs.writeFileSync(
			path.join(inputPath, 'main.tm'),
			'(a <<embedFile:test>> (b (c)))'
		);
		fs.writeFileSync(path.join(inputPath, 'test.tm'), '(x y)');
		return s2j(inputPath, outputPath).then(() => {
			let fileData = fs.readFileSync(path.join(outputPath, 'main.json'));
			expect(JSON.stringify(JSON.parse(fileData))).to.equal(
				JSON.stringify(['a', ['x', 'y'], ['b', ['c']]])
			);
		});
	});
	it('should handle nested embedding before parsing', () => {
		let inputPath = path.join(testPath, 'input');
		mkdirp.sync(inputPath);
		let outputPath = path.join(testPath, 'output');
		mkdirp.sync(outputPath);
		fs.writeFileSync(
			path.join(inputPath, 'main.tm'),
			'(a <<embedFile:test>> (b (c)))'
		);
		fs.writeFileSync(
			path.join(inputPath, 'test.tm'),
			'(x <<embedFile:test2>> y)'
		);
		fs.writeFileSync(path.join(inputPath, 'test2.tm'), '(p q)');
		return s2j(inputPath, outputPath).then(() => {
			let fileData = fs.readFileSync(path.join(outputPath, 'main.json'));
			expect(JSON.stringify(JSON.parse(fileData))).to.equal(
				JSON.stringify(['a', ['x', ['p', 'q'], 'y'], ['b', ['c']]])
			);
		});
	});
	it('should allow multiple embedding of the same file', () => {
		let inputPath = path.join(testPath, 'input');
		mkdirp.sync(inputPath);
		let outputPath = path.join(testPath, 'output');
		mkdirp.sync(outputPath);
		fs.writeFileSync(
			path.join(inputPath, 'main.tm'),
			'(a <<embedFile:test>> (b <<embedFile:test>> (c)))'
		);
		fs.writeFileSync(path.join(inputPath, 'test.tm'), '(x y)');
		return s2j(inputPath, outputPath).then(() => {
			let fileData = fs.readFileSync(path.join(outputPath, 'main.json'));
			expect(JSON.stringify(JSON.parse(fileData))).to.equal(
				JSON.stringify(['a', ['x', 'y'], ['b', ['x', 'y'], ['c']]])
			);
		});
	});
	after(() => {
		rmdir(testPath);
	});
});
