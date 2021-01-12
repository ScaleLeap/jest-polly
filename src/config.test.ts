import './jest-polly'

import fetch from 'node-fetch'
import path from 'path'

import { JestPollyConfigService, jestPollyConfigService } from './config'

describe(`${JestPollyConfigService.name}`, () => {
  it('should export a singleton', () => {
    expect.assertions(1)

    expect(jestPollyConfigService).toBeInstanceOf(JestPollyConfigService)
  })

  it('should have a getter method with defaults', () => {
    expect.assertions(1)

    const svc = new JestPollyConfigService()

    expect(svc.config.recordFailedRequests).toBe(true)
  })

  it('should have a setter method that merges with defaults', () => {
    expect.assertions(3)

    const svc = new JestPollyConfigService()
    svc.config = {
      matchRequestsBy: {
        order: false,
      },
    }

    expect(svc.config.recordFailedRequests).not.toBeUndefined()
    expect(svc.config.matchRequestsBy && svc.config.matchRequestsBy.order).toBe(false)
    expect(svc.config.matchRequestsBy && svc.config.matchRequestsBy.headers).toBe(false)
  })
})

describe(`${JestPollyConfigService.name}`, () => {
  beforeAll(() => {
    jestPollyConfigService.config = {
      persisterOptions: {
        fs: {
          recordingsDir: path.resolve(__dirname, '__foo__'),
        },
      },
    }
  })

  it('updates config in flight', async () => {
    expect.assertions(1)

    const response = await fetch('https://httpstat.us/200')

    expect(response.ok).toBe(true)
  })
})
