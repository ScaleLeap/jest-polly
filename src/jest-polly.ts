import NodeHttpAdapter from '@pollyjs/adapter-node-http'
import { Polly } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import { setupPolly } from 'setup-polly-jest'

import { jestPollyConfigService } from './config'
import { APPLICATION_JSON_MIME } from './constants'
import type { PollyRecording } from './recording-type'
import { secretSanitizer } from './secrets-sanitizer'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

function isJsonMime(text: string) {
  return text.includes(APPLICATION_JSON_MIME)
}

// converts JSON responses from text to JSON objects
// See: https://github.com/Netflix/pollyjs/issues/322
Polly.on('create', (polly) => {
  polly.server
    .any()
    .on('beforePersist', (request, recording: PollyRecording) => {
      const { secrets } = jestPollyConfigService.config

      if (typeof secrets !== 'undefined') {
        Object.assign(recording, secretSanitizer(recording, secrets))
      }

      const { content } = recording.response

      if (
        content &&
        content.mimeType &&
        isJsonMime(content.mimeType) &&
        typeof content.text === 'string'
      ) {
        try {
          content.text = JSON.parse(content.text)
        } catch {
          // noop
        }
      }

      const { postData } = recording.request

      if (
        postData &&
        postData.mimeType &&
        isJsonMime(postData.mimeType) &&
        typeof postData.text === 'string'
      ) {
        try {
          postData.text = JSON.parse(postData.text)
        } catch {
          // noop
        }
      }
    })
    .on('beforeReplay', (request, recording) => {
      const { content } = recording.response

      if (content && content.mimeType && isJsonMime(content.mimeType)) {
        try {
          // allows older-style recordings to exist which had JSON stringified
          if (content && content.text && typeof content.text !== 'string') {
            content.text = JSON.stringify(content.text)
          }
        } catch {
          // noop
        }
      }

      const { postData } = recording.request

      if (postData && postData.mimeType && isJsonMime(postData.mimeType)) {
        try {
          // allows older-style recordings to exist which had JSON stringified
          if (postData && postData.text && typeof postData.text !== 'string') {
            postData.text = JSON.stringify(postData.text)
          }
        } catch {
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
