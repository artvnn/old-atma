const utils = require("../../utils");
const first = utils.first;
const rest = utils.rest;
const second = utils.second;
const isList = utils.isList;

const operator = ast =>
	`(${rest(ast)
		.map(translate)
		.join(` ${first(ast)} `)})`;

const translate = ast => {
	if (!isList(ast)) return ast;
	let codeLines = [];
	let fn = first(ast);
	if (isList(fn)) {
		codeLines = ast.map(translate);
	} else {
		switch (fn) {
			case "let":
				codeLines.push(`let ${second(ast)} = ${translate(rest(rest(ast)))};`);
				break;
			case "+":
			case "-":
			case "/":
			case "*":
				codeLines.push(`${operator(ast)}`);
				break;
			case "String":
				codeLines.push(`"${translate(rest(ast))}"`);
				break;
			case "Date":
				codeLines.push(`(new Date("${translate(rest(ast))}"))`);
				break;
			case "List":
				codeLines.push(`[${rest(second(ast).map(translate)).join(", ")}]`);
				break;
			case "Bool":
			case "Int":
			case "Float":
				codeLines.push(`${translate(rest(ast))}`);
				break;
			default:
				return ast;
		}
	}
	return codeLines;
};

module.exports = ast => translate(ast).join("\n");
