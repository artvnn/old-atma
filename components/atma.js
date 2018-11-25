// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	const nuller = d => null;
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "atma$ebnf$1$subexpression$1", "symbols": ["statement", {"literal":"\n"}]},
    {"name": "atma$ebnf$1", "symbols": ["atma$ebnf$1$subexpression$1"]},
    {"name": "atma$ebnf$1$subexpression$2", "symbols": ["statement", {"literal":"\n"}]},
    {"name": "atma$ebnf$1", "symbols": ["atma$ebnf$1", "atma$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "atma", "symbols": ["atma$ebnf$1"]},
    {"name": "statement", "symbols": ["line_comments"]},
    {"name": "statement", "symbols": ["block_comments"]},
    {"name": "line_comments$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "line_comments$ebnf$1", "symbols": []},
    {"name": "line_comments$ebnf$1", "symbols": ["line_comments$ebnf$1", /[.]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "line_comments", "symbols": ["line_comments$string$1", "line_comments$ebnf$1", {"literal":"\n"}], "postprocess": nuller},
    {"name": "block_comments$string$1", "symbols": [{"literal":"/"}, {"literal":"*"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block_comments$ebnf$1", "symbols": []},
    {"name": "block_comments$ebnf$1", "symbols": ["block_comments$ebnf$1", /[.]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "block_comments$string$2", "symbols": [{"literal":"*"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block_comments", "symbols": ["block_comments$string$1", "block_comments$ebnf$1", "block_comments$string$2"], "postprocess": nuller}
]
  , ParserStart: "atma"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
