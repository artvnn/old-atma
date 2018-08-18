// TODO: Tests need to be created
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");

if (process.argv.length !== 3)
	console.error("Usage: npm run new <project-name-with-full-path>");

const prjName = process.argv[2];
if (fs.existsSync(prjName)) console.error(`Project ${prjName} already exists!`);
mkdirp.sync(prjName);
if (!fs.existsSync(prjName))
	console.error(`Project folder ${prjName} could not be created!`);

const project = {
	source: path.join(prjName, "source"),
	target: path.join(prjName, "target"),
	components: ["a2s", "s2j"],
	build: path.join(prjName, "build")
};
mkdirp.sync(project.source);
fs.writeFileSync(path.join(project.source, "main.atm"), "// TODO\n");
fs.writeFileSync(
	path.join(prjName, "main.js"),
	`
const transpiler = require("${path.join(__dirname)}/transpiler");
const options = ${JSON.stringify(project, null, 2)};

transpiler(options).then(() => { console.log("Done"); });
`
);

console.log(`Project ${prjName} created successfully!`);
