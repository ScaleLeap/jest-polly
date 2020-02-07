import { Polly } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'
import { setupPolly } from 'setup-polly-jest'
import { jestPollyConfigService } from './config'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

// first we instantiate a Polly instance with default configuration
export const jestPollyContext = setupPolly()

// and then before each test run, we'll update it with actual configuration, because
// some of the configuration, depends on being inside a test
beforeEach(() =>
  jestPollyContext.polly.configure(jestPollyConfigService.config),
)

afterEach(() => jestPollyContext.polly.flush())
