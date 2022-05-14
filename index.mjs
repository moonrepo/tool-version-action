import core from '@actions/core';
import * as node from './node.mjs';

function setEnvVar(name, value) {
	core.exportVariable(name, value);
	core.info(`Setting ${name} environment variable`);
	console.log(process.env[name]);
}

try {
	const nodeVersion = core.getInput('node');

	if (nodeVersion) {
		setEnvVar('MOON_NODE_VERSION', await node.resolveVersionFromManifest(nodeVersion));
	}
} catch (error) {
	core.setFailed(error.message);
}
