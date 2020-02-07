import { env } from './env'
import { BaseConfig } from '@scaleleap/config'

describe('env', () => {
  it('should be an instance of BaseConfig', () => {
    expect(env).toBeInstanceOf(BaseConfig)
  })

  it('should have expected properties', () => {
    expect(env.POLLY_MODE).toBeDefined()
    expect(typeof env.POLLY_MODE).toBe('string')

    expect(env.POLLY_RECORD_IF_MISSING).toBeDefined()
    expect(typeof env.POLLY_RECORD_IF_MISSING).toBe('boolean')
  })
})
