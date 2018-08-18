const utils = require('./utils');
const assert = require('chai').assert;
const expect = require('chai').expect;
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const rmdir = utils.rmdir;

require('./test_setup.js');

describe('Utils:', () => {
	describe('rmdir:', () => {
		const rmdir = utils.rmdir;
		it('should return a promise', () => {
			expect(rmdir('some file').then).to.be.a('function');
		});
		it('should not throw error if the folder does not exits', () => {
			return rmdir('some file').should.be.fulfilled;
		});
		it('should delete the given folder', () => {
			let folder = path.join(__dirname, 'test');
			mkdirp.sync(folder);
			return new Promise((resolve, reject) => {
				rmdir(folder).then(
					() => {
						fs.existsSync(folder)
							? reject('Folder exists')
							: resolve();
					},
					e => {
						reject(e);
					}
				);
			});
		});
	});
	describe('clone:', () => {
		let clone = utils.clone;
		it('should clone the given object', () => {
			let input = { a: 1, b: 'Manoj', c: { d: 20.123, e: new Date() } };
			let output = clone(input);
			expect(JSON.stringify(input)).to.deep.equal(JSON.stringify(output));
		});
	});
	describe('deepCopy:', () => {
		let deepCopy = utils.deepCopy;
		it('should copy the folder tree', () => {
			let sourceFolder = path.join(__dirname, 'test', 'f1');
			mkdirp.sync(path.join(sourceFolder, 'f2', 'f3'));
			let targetFolder = path.join(__dirname, 'test', 'temp');
			return deepCopy(sourceFolder, targetFolder).then(() => {
				expect(
					fs.existsSync(path.join(targetFolder, 'f2', 'f3'))
				).to.equal(true);
			});
		});
		after(() => {
			rmdir(path.join(__dirname, 'test'));
		});
	});
	describe('first:', () => {
		let first = utils.first;
		it('should return first element from list', () => {
			expect(first([1, 2, 3])).to.equal(1);
			expect(first(['Manoj', 'Kumar'])).to.equal('Manoj');
		});
		it('should return null if list is null', () => {
			expect(first(null)).to.equal(null);
			expect(first(undefined)).to.equal(null);
		});
		it('should return null if list is empty', () => {
			expect(first([])).to.equal(null);
		});
	});
	describe('rest:', () => {
		let rest = utils.rest;
		it('should return the elements other than the first one', () => {
			expect(rest([1, 2, 3]).join(',')).to.equal([2, 3].join(','));
			expect(rest(['Manoj', 'Kumar', 'Aarav']).join(',')).to.equal(['Kumar', 'Aarav'].join(','));
		});
		it('should return empty list if the list is empty', () => {
			expect(rest([]).length).to.equal(0);
		});
		it('should return empty list if the list is null', () => {
			expect(rest(null).length).to.equal(0);
			expect(rest(undefined).length).to.equal(0);
		});
	});
	describe('second:', () => {
		let second = utils.second;
		it('should return the second element of the given list', () => {
			expect(second([1, 2, 3])).to.equal(2);
			expect(second(['Manoj', 'Kumar', 'Aarav'])).to.equal('Kumar');
		});
		it('should return null if list is null', () => {
			expect(second(null)).to.equal(null);
			expect(second(undefined)).to.equal(null);
		});
		it('should return null if list is empty', () => {
			expect(second([])).to.equal(null);
		});
	});
});
