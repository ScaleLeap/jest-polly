import { dirname, join } from 'path'
import { isCI } from 'ci-info'
import { BaseConfig } from '@scaleleap/config'
import { PollyConfig, MODE } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'
import merge from 'lodash.merge'

const POLLY_MODES: MODE[] = ['replay', 'record', 'passthrough', 'stopped']

class Config extends BaseConfig {
  readonly POLLY_MODE = this.get('POLLY_MODE', POLLY_MODES[0]).asEnum(
    POLLY_MODES,
  ) as MODE

  readonly POLLY_RECORD_IF_MISSING = this.get(
    'POLLY_RECORD_IF_MISSING',
    isCI ? 'false' : 'true',
  ).asBoolStrict()
}

const config = new Config()

const recordingsRoot = dirname(global.jasmine.testPath)
const recordingsDir = join(recordingsRoot, '__recordings__')

const DEFAULT_POLLY_CONFIG: PollyConfig = {
  adapters: [NodeHttpAdapter],
  persister: FSPersister,
  persisterOptions: {
    keepUnusedRequests: false,
    fs: {
      recordingsDir,
    },
  },
  mode: config.POLLY_MODE,
  recordIfMissing: config.POLLY_RECORD_IF_MISSING,
  recordFailedRequests: true,
  matchRequestsBy: {
    headers: false,
    body: false,
  },
}

export class JestPollyConfigService {
  constructor(defaults = DEFAULT_POLLY_CONFIG) {
    this._config = merge({}, defaults)
  }

  private readonly _config: PollyConfig

  get config() {
    return this._config
  }

  set config(config: PollyConfig) {
    merge(this._config, config)
  }
}

export const jestPollyConfigService = new JestPollyConfigService()
