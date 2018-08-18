const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const rmdir = utils.rmdir;
const mkdirp = require('mkdirp');
const deepCopy = utils.deepCopy;

module.exports = function(inputs) {
	return new Promise((resolve, reject) => {
		if (!inputs) {
			reject('No inputs given');
		} else if (!inputs.source) {
			reject('No source folder is specified');
		} else if (!fs.existsSync(path.normalize(inputs.source))) {
			reject('Source folder does not exist');
		} else if (!inputs.components) {
			reject('No components are specified');
		} else if (!inputs.target) {
			reject('No target folder is specified');
		} else {
			transpile(inputs).then(
				() => {
					resolve();
				},
				e => {
					reject(e);
				}
			);
		}
	});
};

function transpile(inputs) {
	return new Promise((resolve, reject) => {
		let componentInputFolder = inputs.source;
		// Start
		prepareBuildFolder();

		function prepareBuildFolder() {
			rmdir(inputs.build).then(
				() => {
					try {
						// Create Build Folder
						mkdirp.sync(inputs.build);
						// Copy the inputs files into build folder
						let buildSourceDir = path.join(
							inputs.build,
							'00_source'
						);
						mkdirp.sync(buildSourceDir);
						deepCopy(inputs.source, buildSourceDir).then(
							() => {
								processComponents();
							},
							e => {
								reject(e);
							}
						);
					} catch (err) {
						reject(err);
					}
				},
				e => {
					reject(e);
				}
			);
		}

		function processComponents(componentIndex) {
			try {
				componentIndex = componentIndex || 0;
				if (componentIndex >= inputs.components.length) {
					// No more components to be processed
					processOutput();
					return;
				}
				let component = inputs.components[componentIndex],
					componentFolder = path.join(
						inputs.build,
						(componentIndex < 10 ? '0' : '') +
							(componentIndex + 1) +
							'_' +
							component
					),
					componentModule = require('./components/' + component);
				mkdirp.sync(componentFolder);
				componentModule(componentInputFolder, componentFolder).then(
					() => {
						componentInputFolder = componentFolder;
						process.nextTick(processComponents, componentIndex + 1);
					},
					e => {
						reject(e);
					}
				);
			} catch (err) {
				reject(err);
			}
		}

		function processOutput() {
			try {
				// Create target folder and copy results of the last component into it
				mkdirp.sync(inputs.target);
				var componentFolder = path.join(
					inputs.build,
					(inputs.components.length - 1 < 10 ? '0' : '') +
						inputs.components.length +
						'_' +
						inputs.components[inputs.components.length - 1]
				);
				deepCopy(componentFolder, inputs.target).then(
					() => {
						resolve();
					},
					e => {
						reject(e);
					}
				);
			} catch (err) {
				reject(err);
			}
		}
	});
}
