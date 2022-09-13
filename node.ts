// Code is loosely based on the official `setup-node` action:
// @see https://github.com/actions/setup-node/blob/main/src/installer.ts

import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

function isFullyQualifiedVersion(version: string) {
	return version.split('.').length >= 3;
}

// https://nodejs.org/dist/index.json
// https://github.com/actions/node-versions/blob/main/versions-manifest.json
export async function resolveVersionFromManifest(version: string) {
	core.info('Getting manifest from actions/node-versions@main');

	const manifest = await tc.getManifestFromRepo('actions', 'node-versions', undefined, 'main');

	core.info(`Resolving version "${version}" from manifest`);

	const result = await tc.findFromManifest(
		isFullyQualifiedVersion(version) ? version : `~${version}`,
		true,
		manifest,
	);

	if (result && result.files.length > 0) {
		core.info(`Resolved to version "${result.version}"`);

		return result.version;
	}

	throw new Error(`Unable to find a version for value "${version}"!`);
}
