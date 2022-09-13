import * as core from '@actions/core';
import * as node from './node';

function setEnvVar(name: string, value:string) {
	core.exportVariable(name, value);
	core.info(`Setting ${name} environment variable`);

	// eslint-disable-next-line no-console
	console.log(process.env[name]);
}

async function run() {
	try {
		const nodeVersion = core.getInput('node');

		if (nodeVersion) {
			setEnvVar('MOON_NODE_VERSION', await node.resolveVersionFromManifest(nodeVersion));
		}
	} catch (error: unknown) {
		core.setFailed((error as Error).message);
	}
}

void run();
