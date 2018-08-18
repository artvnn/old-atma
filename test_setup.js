'use strict';
// Adapted from: https://github.com/domenic/chai-as-promised/blob/master/test/support/setup.js

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const assert = chai.assert;

chai.should();
chai.use(chaiAsPromised);

process.on('unhandledRejection', () => {
	// Do nothing; we test these all the time.
});
process.on('rejectionHandled', () => {
	// Do nothing; we test these all the time.
});
