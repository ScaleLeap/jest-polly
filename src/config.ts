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

export class JestPollyConfigService {
  private _config!: PollyConfig

  /**
   * Factory method is used to invoke config generation, because `global.jasmine` object is
   * only available inside a test or lifecycle methods (before, after).
  */
  private factory(): PollyConfig {
    const recordingsRoot = dirname(global.jasmine.testPath)
    const recordingsDir = join(recordingsRoot, '__recordings__')

    return {
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
  }

  private init() {
    if (!this._config) {
      this._config = this.factory()
    }
  }

  get config() {
    this.init()
    return this._config
  }

  set config(config: PollyConfig) {
    this.init()
    merge(this._config, config)
  }
}

export const jestPollyConfigService = new JestPollyConfigService()
