import { dirname, join } from 'path';
import { isCI } from 'ci-info';
import { PollyConfig, MODE } from '@pollyjs/core';
import FSPersister from '@pollyjs/persister-fs';
import NodeHttpAdapter from '@pollyjs/adapter-node-http';
import merge from 'lodash.merge';

const DEFAULT_POLLY_MODE: MODE = 'replay';
const mode = process.env.POLLY_MODE || DEFAULT_POLLY_MODE;

const recordingsRoot = dirname(global.jasmine.testPath);
const recordingsDir = join(recordingsRoot, '__recordings__');

const recordIfMissing = !isCI;

const DEFAULT_POLLY_CONFIG: PollyConfig = {
	adapters: [NodeHttpAdapter],
	persister: FSPersister,
	persisterOptions: {
		keepUnusedRequests: false,
		fs: {
			recordingsDir
		}
	},
	mode,
	recordIfMissing,
	recordFailedRequests: true,
	matchRequestsBy: {
		headers: false,
		body: false
	}
};

export class JestPollyConfigService {
	public constructor(defaults = DEFAULT_POLLY_CONFIG) {
		this._config = merge({}, defaults);
  }

	private readonly _config: PollyConfig;

	public get config() {
	  return this._config;
	}

	public set config(config: PollyConfig) {
	  merge(this._config, config);
	}
}

export const jestPollyConfigService = new JestPollyConfigService();
