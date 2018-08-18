const utils = require('./utils');
const assert = require('chai').assert;
const expect = require('chai').expect;
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const rmdir = utils.rmdir;
const clone = utils.clone;
const transpiler = require('./transpiler');

require('./test_setup.js');

describe('Athma Transpiler:', () => {
	let testDir = path.normalize(path.join(__dirname, './test')),
		sourceDir = path.join(testDir, 'source'),
		buildDir = path.join(testDir, 'build'),
		targetDir = path.join(testDir, 'target'),
		optionsOriginal = {
			source: sourceDir,
			target: targetDir,
			components: ['mock'],
			build: buildDir
		};
	beforeEach(() => {
		return new Promise(function(resolve, reject) {
			rmdir(testDir).then(
				() => {
					try {
						mkdirp.sync(sourceDir);
						fs.writeFileSync(
							path.join(sourceDir, 'main.tm'),
							'/* main.tm */'
						);
						resolve();
					} catch (err) {
						reject(err);
					}
				},
				e => {
					reject(e);
				}
			);
		});
	});
	it('should throw error when no options are given', () => {
		return transpiler().should.be.rejectedWith('No inputs given');
	});
	it('should throw error when no source folder is specified', () => {
		let options = clone(optionsOriginal);
		delete options.source;
		return transpiler(options).should.be.rejectedWith(
			'No source folder is specified'
		);
	});
	it('should throw error when source folder does not exist', () => {
		let options = clone(optionsOriginal);
		options.source = 'blah';
		return transpiler(options).should.be.rejectedWith(
			'Source folder does not exist'
		);
	});
	it('should not throw error when source folder exists', () => {
		let options = clone(optionsOriginal);
		return transpiler(options).should.not.be.rejectedWith(
			'Source folder does not exist'
		);
	});
	it('should throw error when no components are specified', () => {
		let options = clone(optionsOriginal);
		delete options.components;
		return transpiler(options).should.be.rejectedWith(
			'No components are specified'
		);
	});
	it('should delete build folder if it already exists', function() {
		let options = clone(optionsOriginal);
		mkdirp.sync(buildDir);
		let testFile = path.join(buildDir, 'test.txt');
		fs.writeFileSync(testFile, 'Testing, please ignore.');
		return transpiler(options).then(() => {
			expect(fs.existsSync(testFile)).to.equal(false);
		});
	});
	it('should create build folder', () => {
		let options = clone(optionsOriginal);
		return transpiler(options).then(() => {
			expect(fs.existsSync(buildDir)).to.equal(true);
		});
	});
	it('should copy all source files into the build folder, in a sub-folder called "00_source"', () => {
		let options = clone(optionsOriginal);
		return transpiler(options).then(() => {
			expect(
				fs.existsSync(path.join(buildDir, '00_source', 'main.tm'))
			).to.equal(true);
		});
	});
	it('should create one folder for each of the components', () => {
		let options = clone(optionsOriginal);
		options.components = ['mock', 'mock', 'mock'];
		return transpiler(options).then(() => {
			let folderNotFound = false;
			options.components.forEach(function(component, idx) {
				let folder = path.join(
					buildDir,
					(idx < 10 ? '0' : '') + (idx + 1) + '_' + component
				);
				if (!fs.existsSync(folder)) folderNotFound = true;
			});
			expect(folderNotFound).to.equal(false);
		});
	});
	it('should invoke the component and pass input and output paths to it', () => {
		let options = clone(optionsOriginal);
		return transpiler(options).then(() => {
			let sourceFile = path.join(buildDir, '00_source', 'main.tm'),
				sourceFileExists = fs.existsSync(sourceFile),
				targetFile = path.join(buildDir, '01_mock', 'main.tm'),
				targetFileExists = fs.existsSync(targetFile);
			expect(sourceFileExists && targetFileExists).to.equal(true);
		});
	});
	it('should throw error when no target folder is specified', () => {
		let options = clone(optionsOriginal);
		delete options.target;
		return transpiler(options).should.be.rejectedWith(
			'No target folder is specified'
		);
	});
	it('should create target folder', () => {
		let options = clone(optionsOriginal);
		return transpiler(options).then(() => {
			let targetFolderExists = fs.existsSync(targetDir);
			expect(targetFolderExists).to.equal(true);
		});
	});
	it('should copy the contents of the last component folder into the target folder', () => {
		let options = clone(optionsOriginal);
		return transpiler(options).then(() => {
			let targetFile = path.join(targetDir, 'main.tm'),
				targetFileExists = fs.existsSync(targetFile);
			expect(targetFileExists).to.equal(true);
		});
	});
	afterEach(() => {
		return new Promise(function(resolve, reject) {
			rmdir(testDir).then(
				() => {
					resolve();
				},
				e => {
					reject(e);
				}
			);
		});
	});
});
