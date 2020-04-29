import NodeHttpAdapter from '@pollyjs/adapter-node-http'
import { PollyConfig } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import merge from 'lodash.merge'
import { dirname, join } from 'path'

import { environment } from './environment'

export class JestPollyConfigService {
  private $config!: PollyConfig

  /**
   * Factory method is used to invoke config generation, because `global.jasmine` object is
   * only available inside a test or lifecycle methods (before, after).
   */
  // eslint-disable-next-line class-methods-use-this
  private factory(): PollyConfig {
    const recordingsRoot = dirname(global.jasmine.testPath)
    const recordingsDirectory = join(recordingsRoot, '__recordings__')

    return {
      adapters: [NodeHttpAdapter],
      persister: FSPersister,
      persisterOptions: {
        keepUnusedRequests: false,
        fs: {
          recordingsDir: recordingsDirectory,
        },
      },
      mode: environment.POLLY_MODE,
      recordIfMissing: environment.POLLY_RECORD_IF_MISSING,
      recordFailedRequests: true,
      matchRequestsBy: {
        headers: false,
        body: false,
      },
    }
  }

  private init() {
    if (!this.$config) {
      this.$config = this.factory()
    }
  }

  get config() {
    this.init()
    return this.$config
  }

  set config(config: PollyConfig) {
    this.init()
    merge(this.$config, config)
  }
}

export const jestPollyConfigService = new JestPollyConfigService()
