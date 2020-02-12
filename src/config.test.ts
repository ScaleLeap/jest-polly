import { JestPollyConfigService, jestPollyConfigService } from './config'
import { resolve } from 'path'
import fetch from 'node-fetch'
import './jest-polly'

describe(JestPollyConfigService.name, () => {
  it('should export a singleton', () => {
    expect.assertions(1)

    expect(jestPollyConfigService).toBeInstanceOf(JestPollyConfigService)
  })

  it('should have a getter method with defaults', () => {
    expect.assertions(1)

    const svc = new JestPollyConfigService()
    expect(svc.config.recordFailedRequests).toBeTruthy()
  })

  it('should have a setter method that merges with defaults', () => {
    expect.assertions(3)

    const svc = new JestPollyConfigService()
    svc.config = {
      matchRequestsBy: {
        order: false,
      },
    }

    expect(svc.config.recordFailedRequests).toBeTruthy()

    if (svc.config.matchRequestsBy) {
      expect(svc.config.matchRequestsBy.order).toBe(false)
      expect(svc.config.matchRequestsBy.headers).toBe(false)
    }
  })
})

describe(JestPollyConfigService.name, () => {
  beforeAll(() => {
    jestPollyConfigService.config = {
      persisterOptions: {
        fs: {
          recordingsDir: resolve(__dirname, '__foo__'),
        },
      },
    }
  })

  it('updates config in flight', async () => {
    const response = await fetch('https://httpstat.us/200')
    expect(response.ok).toBeTruthy()
  })
})
