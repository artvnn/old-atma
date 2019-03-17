const utils = require("../../utils");
const expect = require("chai").expect;
const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");
const rmdir = utils.rmdir;
const t2j = require("./t2j");

/* eslint-env node, mocha */
require("../../test_setup.js");

describe("Tesman to JSON convertor: ", () => {
	let testPath;
	before(() => {
		testPath = path.join(__dirname, "test_t2j");
		mkdirp.sync(testPath);
	});
	it("should parse a single file", () => {
		let inputPath = path.join(testPath, "input");
		mkdirp.sync(inputPath);
		let outputPath = path.join(testPath, "output");
		mkdirp.sync(outputPath);
		fs.writeFileSync(path.join(inputPath, "main.tm"), "(a (b (c)))");
		return t2j(inputPath, outputPath).then(() => {
			let fileData = fs.readFileSync(path.join(outputPath, "main.json"));
			expect(JSON.stringify(JSON.parse(fileData))).to.equal(
				JSON.stringify(["a", ["b", ["c"]]])
			);
		});
	});
	it("should embed files before parsing", () => {
		let inputPath = path.join(testPath, "input");
		mkdirp.sync(inputPath);
		let outputPath = path.join(testPath, "output");
		mkdirp.sync(outputPath);
		fs.writeFileSync(
			path.join(inputPath, "main.tm"),
			"(a <<embedFile:test>> (b (c)))"
		);
		fs.writeFileSync(path.join(inputPath, "test.tm"), "(x y)");
		return t2j(inputPath, outputPath).then(() => {
			let fileData = fs.readFileSync(path.join(outputPath, "main.json"));
			expect(JSON.stringify(JSON.parse(fileData))).to.equal(
				JSON.stringify(["a", ["x", "y"], ["b", ["c"]]])
			);
		});
	});
	it("should handle nested embedding before parsing", () => {
		let inputPath = path.join(testPath, "input");
		mkdirp.sync(inputPath);
		let outputPath = path.join(testPath, "output");
		mkdirp.sync(outputPath);
		fs.writeFileSync(
			path.join(inputPath, "main.tm"),
			"(a <<embedFile:test>> (b (c)))"
		);
		fs.writeFileSync(
			path.join(inputPath, "test.tm"),
			"(x <<embedFile:test2>> y)"
		);
		fs.writeFileSync(path.join(inputPath, "test2.tm"), "(p q)");
		return t2j(inputPath, outputPath).then(() => {
			let fileData = fs.readFileSync(path.join(outputPath, "main.json"));
			expect(JSON.stringify(JSON.parse(fileData))).to.equal(
				JSON.stringify(["a", ["x", ["p", "q"], "y"], ["b", ["c"]]])
			);
		});
	});
	it("should allow multiple embedding of the same file", () => {
		let inputPath = path.join(testPath, "input");
		mkdirp.sync(inputPath);
		let outputPath = path.join(testPath, "output");
		mkdirp.sync(outputPath);
		fs.writeFileSync(
			path.join(inputPath, "main.tm"),
			"(a <<embedFile:test>> (b <<embedFile:test>> (c)))"
		);
		fs.writeFileSync(path.join(inputPath, "test.tm"), "(x y)");
		return t2j(inputPath, outputPath).then(() => {
			let fileData = fs.readFileSync(path.join(outputPath, "main.json"));
			expect(JSON.stringify(JSON.parse(fileData))).to.equal(
				JSON.stringify(["a", ["x", "y"], ["b", ["x", "y"], ["c"]]])
			);
		});
	});
	after(() => {
		rmdir(testPath);
	});
});
