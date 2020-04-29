import NodeHttpAdapter from '@pollyjs/adapter-node-http'
import { Polly } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import { setupPolly } from 'setup-polly-jest'

import { jestPollyConfigService } from './config'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

// converts JSON responses from text to JSON objects
// See: https://github.com/Netflix/pollyjs/issues/322
Polly.on('create', (polly) => {
  polly.server
    .any()
    .on('beforePersist', (request, recording) => {
      const { content } = recording.response

      if (content && content.mimeType && content.mimeType.includes('application/json')) {
        try {
          content.text = JSON.parse(content.text)
        } catch (error) {
          // noop
        }
      }
    })
    .on('beforeReplay', (request, recording) => {
      const { content } = recording.response

      if (content && content.mimeType && content.mimeType.includes('application/json')) {
        try {
          // allows older-style recordings to exist which had JSON stringified
          if (content && content.text && typeof content.text !== 'string') {
            content.text = JSON.stringify(content.text)
          }
        } catch (error) {
          // noop
        }
      }
    })
})

// We have to define our own "Context" here, and can't re-use types from
// "@types/setup-polly-jest" package, because, for some reason, there is a problem with
// exporting the type and when importing @scaleleap/jest-polly in consuming modules,
// the result is typed as "any"
export interface JestPollyContext {
  readonly polly: Polly
}

// first we instantiate a Polly instance with default configuration
export const jestPollyContext: JestPollyContext = setupPolly()

// and then before each test run, we'll update it with actual configuration, because
// some of the configuration, depends on being inside a test
// eslint-disable-next-line jest/require-top-level-describe
beforeEach(() => jestPollyContext.polly.configure(jestPollyConfigService.config))

// eslint-disable-next-line jest/require-top-level-describe
afterEach(() => jestPollyContext.polly.flush())
