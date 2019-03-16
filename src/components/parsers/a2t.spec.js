// const utils = require("../utils");
// const expect = require("chai").expect;
// const mkdirp = require("mkdirp");
// const path = require("path");
// const fs = require("fs");
// const a2t = require("./a2t");
// const rmdir = utils.rmdir;

// require("../test_setup.js");

// describe("Atma to Tesman Translator", () => {
// 	let testPath;
// 	before(() => {
// 		testPath = path.join(__dirname, "test_a2t");
// 		mkdirp.sync(testPath);
// 	});
// 	it("should ignore comments", () => {
// 		let inputPath = path.join(testPath, "input");
// 		mkdirp.sync(inputPath);
// 		let outputPath = path.join(testPath, "output");
// 		mkdirp.sync(outputPath);
// 		const singleLineComment = "// Single line comment";
// 		const multiLineComment = "/* Multiline\ncomment*/";
// 		fs.writeFileSync(
// 			path.join(inputPath, "main.atm"),
// 			[singleLineComment, multiLineComment].join("\n")
// 		);
// 		return a2t(inputPath, outputPath).then(() => {
// 			let fileData = fs.readFileSync(path.join(outputPath, "main.tm"), {
// 				encoding: "utf8"
// 			});
// 			const positionOf = {
// 				singleLineComment: fileData.indexOf(singleLineComment),
// 				multiLineComment: fileData.indexOf(multiLineComment)
// 			};
// 			expect(positionOf.multiLineComment >= 0).to.equal(false);
// 			expect(positionOf.singleLineComment >= 0).to.equal(false);
// 		});
// 	});
// 	it("should encode strings correctly", () => {
// 		let inputPath = path.join(testPath, "input");
// 		mkdirp.sync(inputPath);
// 		let outputPath = path.join(testPath, "output");
// 		mkdirp.sync(outputPath);
// 		const multiLineString =
// 			'(ignore `single line` `line 1\nline 2\nline 3 with \\"`)';
// 		fs.writeFileSync(path.join(inputPath, "main.atm"), multiLineString);
// 		return a2t(inputPath, outputPath).then(() => {
// 			let fileData = fs.readFileSync(path.join(outputPath, "main.tm"), {
// 				encoding: "utf8"
// 			});
// 			expect(
// 				fileData.indexOf(
// 					'(ignore \'"single line"\' (m-str \'"line 1"\' \'"line 2"\' \'"line 3 with \\""\'))'
// 				) >= 0
// 			).to.equal(true);
// 		});
// 	});
// 	it("should remove empty lines", () => {
// 		let inputPath = path.join(testPath, "input");
// 		mkdirp.sync(inputPath);
// 		let outputPath = path.join(testPath, "output");
// 		mkdirp.sync(outputPath);
// 		const multiLineString = "(a)\n\n(b)\n";
// 		fs.writeFileSync(path.join(inputPath, "main.atm"), multiLineString);
// 		return a2t(inputPath, outputPath).then(() => {
// 			let fileData = fs.readFileSync(path.join(outputPath, "main.tm"), {
// 				encoding: "utf8"
// 			});
// 			expect(fileData.indexOf("(a)\n(b)") >= 0).to.equal(true);
// 		});
// 	});
// 	it("should wrap lines with '(' and ')', if required and remove empty lines", () => {
// 		let inputPath = path.join(testPath, "input");
// 		mkdirp.sync(inputPath);
// 		let outputPath = path.join(testPath, "output");
// 		mkdirp.sync(outputPath);
// 		fs.writeFileSync(
// 			path.join(inputPath, "main.atm"),
// 			`
// sys : sample \`Sample
// application\`

// 	client : cl \`Web client\`

// 		string : session-token fullname

// 		view : splash
// 			message \`Welcome to Sample App!\`
// 			action \`Start\` => go-to-view login

// 	server : srv \`Web server\`

// 		service : login
// 			=> [email : user-id, password : password]

// 		(service : logout)

// 	store : db \`Database\`

// 		entity : user`
// 		);
// 		return a2t(inputPath, outputPath).then(() => {
// 			let fileData = fs.readFileSync(path.join(outputPath, "main.tm"), {
// 				encoding: "utf8"
// 			});
// 			expect(fileData).to.equal(
// 				`(sys : sample (m-str '"Sample"' '"application"')
// 	(client : cl '"Web client"'
// 		(string : session-token fullname)
// 		(view : splash
// 			(message '"Welcome to Sample App!"')
// 			(action '"Start"' => go-to-view login)))
// 	(server : srv '"Web server"'
// 		(service : login
// 			(=> [email : user-id, password : password]))
// 		(service : logout))
// 	(store : db '"Database"'
// 		(entity : user)))`
// 			);
// 		});
// 	});

// 	after(() => {
// 		rmdir(testPath);
// 	});
// });
