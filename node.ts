// Code is loosely based on the official `setup-node` action:
// @see https://github.com/actions/setup-node/blob/main/src/installer.ts

import * as core from '@actions/core';
import * as hc from '@actions/http-client';
import * as tc from '@actions/tool-cache';

function isFullyQualifiedVersion(version: string) {
	return version.split('.').length >= 3;
}

async function findVersionInManifest(version: string, manifest: tc.IToolRelease[]) {
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

	return null;
}

// https://nodejs.org/dist/index.json
export async function resolveVersionFromDist(version: string) {
	core.info('Getting manifest from nodejs.org');

	const httpClient = new hc.HttpClient('moonrepo/tool-version-action', [], {
		allowRetries: true,
		maxRetries: 3,
	});
	const response = await httpClient.getJson<
		{ version: string; files: []; lts: boolean | string }[]
	>('https://nodejs.org/dist/index.json');

	// Convert dist response into a tool manifest
	const manifest: tc.IToolRelease[] = [];

	response.result?.forEach((result) => {
		const files: tc.IToolReleaseFile[] = [];

		result.files.forEach((file) => {
			switch (file) {
				case 'linux-x64': {
					const filename = `node-${result.version}-linux-x64.tar.gz`;

					files.push({
						arch: 'x64',
						download_url: `https://nodejs.org/dist/${result.version}/${filename}`,
						filename,
						platform: 'linux',
					});
					break;
				}

				case 'osx-x64-tar': {
					const filename = `node-${result.version}-darwin-x64.tar.gz`;

					files.push({
						arch: 'x64',
						download_url: `https://nodejs.org/dist/${result.version}/${filename}`,
						filename,
						platform: 'darwin',
					});
					break;
				}

				case 'win-x64-7z': {
					const filename = `node-${result.version}-win-x64.zip`;

					files.push({
						arch: 'x64',
						download_url: `https://nodejs.org/dist/${result.version}/${filename}`,
						filename,
						platform: 'win32',
					});
					break;
				}

				default:
					break;
			}
		});

		manifest.push({
			files,
			release_url: '', // not needed
			stable: true,
			version: result.version.slice(1), // remove v prefix
		});
	});

	return findVersionInManifest(version, manifest);
}

// https://github.com/actions/node-versions/blob/main/versions-manifest.json
export async function resolveVersionFromManifest(version: string) {
	core.info('Getting manifest from actions/node-versions@main');

	const manifest = await tc.getManifestFromRepo('actions', 'node-versions', undefined, 'main');

	return findVersionInManifest(version, manifest);
}
