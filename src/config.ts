import { dirname, join } from 'path'
import { PollyConfig } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'
import merge from 'lodash.merge'
import { env } from './env'

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
      mode: env.POLLY_MODE,
      recordIfMissing: env.POLLY_RECORD_IF_MISSING,
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
