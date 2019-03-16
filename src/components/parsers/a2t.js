const path = require("path");
const fs = require("fs");
// const { replaceAll, pipe } = require("../utils");
const nearley = require("nearley");
const shell = require("shelljs");
// const grammar = require("./atma.js");

module.exports = (inputPath, outputPath) => {
	// function getTabCount(line) {
	// 	let tabCount = 0;
	// 	let tabs = [];
	// 	line.split("").forEach(c => {
	// 		if (c === "\t") {
	// 			tabCount++;
	// 			tabs.push("\t");
	// 		} else return true;
	// 	});
	// 	tabs = tabs.join("");
	// 	return { tabCount, tabs };
	// }

	function toTesmanCode(atmaCode) {
		shell.exec(`nearleyc ${__dirname}/atma.ne -o ${__dirname}/atma.js`);
		const grammar = require("./atma.js");
		const parser = new nearley.Parser(
			nearley.Grammar.fromCompiled(grammar)
		);
		try {
			parser.feed(atmaCode);
			return parser.results;
		} catch (err) {
			return `/*\nCOMPILE ERROR:\n\n${err}\n*/`;
		}
		// return pipe(
		// 	removeSingleLineComments,
		// 	removeMultiLineComments,
		// 	encodeStrings,
		// 	removeEmptyLines
		// )(atmaCode);
	}

	// function removeSingleLineComments(code) {
	// 	return code
	// 		.split("\n")
	// 		.map(line => line.split("//")[0])
	// 		.join("\n");
	// }

	// function removeMultiLineComments(code) {
	// 	return code
	// 		.split("/*")
	// 		.map((item, i) => {
	// 			let result = item;
	// 			if (i % 2 === 1) {
	// 				let temp = item.split("*/");
	// 				result = temp.length > 1 ? temp[1] : "";
	// 			}
	// 			return result;
	// 		})
	// 		.join("");
	// }

	// function encodeStrings(code) {
	// 	return code
	// 		.split("`")
	// 		.map((item, i) => (i % 2 === 0 ? item : encodeString(item)))
	// 		.join("");
	// }

	// function encodeString(str) {
	// 	if (str.indexOf("\n") >= 0) {
	// 		return `(m-str ${str
	// 			.split("\n")
	// 			.map(encodeSingleLineString)
	// 			.join(" ")})`;
	// 	} else return encodeSingleLineString(str);
	// }

	// function encodeSingleLineString(str) {
	// 	return `'"${pipe(
	// 		escapeQuote,
	// 		escapeOpenParenthesis,
	// 		escapeCloseParenthesis
	// 	)(str)}"'`;
	// }

	// function escapeQuote(str) {
	// 	return replaceAll(str, "'", "\\'");
	// }

	// function escapeOpenParenthesis(str) {
	// 	return replaceAll(str, "(", "\\(");
	// }

	// function escapeCloseParenthesis(str) {
	// 	return replaceAll(str, ")", "\\)");
	// }

	// function removeEmptyLines(code) {
	// 	return code
	// 		.split("\n")
	// 		.filter(line => line.trim().length > 0)
	// 		.join("\n");
	// }

	// function addParentheses(code) {
	// 	let stack = [],
	// 		popStack = count => {
	// 			let result = [];
	// 			while (stack.length > count) result.push(stack.pop());
	// 			return result.join("");
	// 		};
	// 	return code
	// 		.split("\n")
	// 		.map((line, idx, array) => {
	// 			let { tabs } = getTabCount(line);
	// 			let nextTabCount = 0;
	// 			if (idx < array.length - 1)
	// 				nextTabCount = getTabCount(array[idx + 1]).tabCount;
	// 			let lineWithoutTabs = line.trim();
	// 			stack.push(lineWithoutTabs[0] === "(" ? "" : ")");
	// 			return (
	// 				tabs +
	// 				(lineWithoutTabs[0] !== "(" ? "(" : "") +
	// 				lineWithoutTabs +
	// 				popStack(nextTabCount)
	// 			);
	// 		})
	// 		.join("\n");
	// }

	return new Promise((resolve, reject) => {
		try {
			let atmaCode = fs.readFileSync(
				path.join(inputPath, "main.atm"),
				"utf8"
			);
			fs.writeFileSync(
				path.join(outputPath, "main.tm"),
				toTesmanCode(atmaCode)
			);
			resolve();
		} catch (err) {
			reject(err);
		}
	});
};
