import { Polly } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'
import { setupPolly } from 'setup-polly-jest'
import { jestPollyConfigService } from './config'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

// converts JSON responses from text to JSON objects
// See: https://github.com/Netflix/pollyjs/issues/322
Polly.on('create', polly => {
  polly.server
    .any()
    .on('beforePersist', (req, recording) => {
      const { content } = recording.response

      if (content.mimeType.includes('application/json')) {
        try {
          content.text = JSON.parse(content.text)
        } catch (e) {
          // noop
        }
      }
    })
    .on('beforeReplay', (req, recording) => {
      const { content } = recording.response

      if (content.mimeType.includes('application/json')) {
        try {
          content.text = JSON.stringify(content.text)
        } catch (e) {
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
beforeEach(() => {
  jestPollyContext.polly.configure(jestPollyConfigService.config)
})

afterEach(() => jestPollyContext.polly.flush())
