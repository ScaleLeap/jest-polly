import { Polly } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'
import { setupPolly } from 'setup-polly-jest'
import { jestPollyConfigService } from './config'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

export const jestPollyContext = setupPolly(jestPollyConfigService.config)

afterEach(() => jestPollyContext.polly.flush())
