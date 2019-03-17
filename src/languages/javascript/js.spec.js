const expect = require("chai").expect;
const js = require("./js");

/* eslint-env node, mocha */
require("../../test_setup.js");

describe("Javascript Translator", () => {
	it("should translate constant declarations", () => {
		const generatedJsCode = js([
			["let", "b1", ["Bool", "true"]],
			["let", "b2", ["Bool", "false"]],
			["let", "i1", ["Int", "123"]],
			["let", "i2", ["Int", "1234567890"]],
			["let", "s1", ["String", "Manoj"]],
			["let", "s2", ["String", "Kumar"]],
			["let", "f1", ["Float", "1.23"]],
			["let", "f2", ["Float", "1234.5678"]],
			["let", "d1", ["Date", "2018/07/17"]],
			["let", "l1", ["List", ["`", "1", "2", "3"]]],
		]);
		const expectedJsCode = `let b1 = true;
let b2 = false;
let i1 = 123;
let i2 = 1234567890;
let s1 = "Manoj";
let s2 = "Kumar";
let f1 = 1.23;
let f2 = 1234.5678;
let d1 = (new Date("2018/07/17"));
let l1 = [1, 2, 3];`;

		expect(generatedJsCode).to.equal(expectedJsCode);
	});

	it("should translate mathematical operations", () => {
		const generatedJsCode = js([
			["let", "sum", ["+", "123", "456"]],
			["let", "diff", ["-", "123", "456", "-23", "45"]],
			["let", "prod", ["*", "123", "456"]],
			["let", "div", ["/", ["+", "123", "6"], "456"]],
		]);

		const expectedJsCode = `let sum = (123 + 456);
let diff = (123 - 456 - -23 - 45);
let prod = (123 * 456);
let div = ((123 + 6) / 456);`;

		expect(generatedJsCode).to.equal(expectedJsCode);
	});
});
