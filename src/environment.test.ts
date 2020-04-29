import { BaseConfig } from '@scaleleap/config'

import { environment } from './environment'

describe('env', () => {
  it('should be an instance of BaseConfig', () => {
    expect.assertions(1)

    expect(environment).toBeInstanceOf(BaseConfig)
  })

  it('should have expected properties', () => {
    expect.assertions(4)

    expect(environment.POLLY_MODE).toBeDefined()
    expect(typeof environment.POLLY_MODE).toBe('string')

    expect(environment.POLLY_RECORD_IF_MISSING).toBeDefined()
    expect(typeof environment.POLLY_RECORD_IF_MISSING).toBe('boolean')
  })
})
