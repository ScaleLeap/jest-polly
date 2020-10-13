import { POLLY_MODE, POLLY_RECORD_IF_MISSING } from './environment'

describe('env', () => {
  it('should have expected properties', () => {
    expect.assertions(4)

    expect(POLLY_MODE).toBeDefined()
    expect(typeof POLLY_MODE).toBe('string')

    expect(POLLY_RECORD_IF_MISSING).toBeDefined()
    expect(typeof POLLY_RECORD_IF_MISSING).toBe('boolean')
  })
})
