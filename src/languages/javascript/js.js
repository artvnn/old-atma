const utils = require("../../utils");
const first = utils.first;
const rest = utils.rest;
const second = utils.second;

const dataType = ast => {
	let type = first(ast);
	var val = "";
	switch (type) {
		case "String":
			val = `"${second(ast)}"`;
			break;
		case "Date":
			val = `new Date("${second(ast)}")`;
			break;
		case "List":
			val = `[${rest(second(ast)).join(", ")}]`;
			break;
		default:
			val = second(ast);
			break;
	}
	return val;
};

const translate = ast => {
	let codeLines = [];
	let fn = first(ast);
	if (fn instanceof Array) {
		codeLines = ast.map(translate);
	} else {
		switch (fn) {
			case "let":
				codeLines.push(`let ${second(ast)} = ${dataType(rest(ast))};`);
				break;
			default:
				throw new Error(
					"Invalid element: " + fn + ", ast: " + JSON.stringify(ast)
				);
		}
	}
	return codeLines;
};

module.exports = ast => translate(ast).join("\n");
