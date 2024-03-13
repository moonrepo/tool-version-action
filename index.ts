import * as core from '@actions/core';
import * as node from './node';

function setEnvVar(name: string, value: string) {
	core.exportVariable(name, value);
	core.info(`Setting ${name} environment variable`);

	// eslint-disable-next-line no-console
	console.log(process.env[name]);
}

async function run() {
	core.warning('This action is deprecated and will be removed in the future.');
	core.warning(
		'moon >= 1.14 supports partial versions, and overriding versions with environment variables.',
	);
	core.warning('Learn more: https://moonrepo.dev/docs/guides/open-source');

	try {
		const nodeVersion = core.getInput('node');

		if (nodeVersion) {
			const version =
				(await node.resolveVersionFromDist(nodeVersion)) ??
				(await node.resolveVersionFromManifest(nodeVersion));

			if (version === null) {
				throw new Error(`Unable to find a version for value "${nodeVersion}"!`);
			}

			setEnvVar('MOON_NODE_VERSION', version);
		}
	} catch (error: unknown) {
		core.setFailed((error as Error).message);
	}
}

void run();
