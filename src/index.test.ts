import { Polly } from '@pollyjs/core'
import { JestPollyConfigService } from './config'
import { jestPollyContext, jestPollyConfigService } from '.'

describe('index', () => {
  it('exports polly instance', () => {
    expect(jestPollyContext.polly).toBeInstanceOf(Polly)
  })

  it('exports polly config service', () => {
    expect(jestPollyConfigService).toBeInstanceOf(JestPollyConfigService)
  })
})
