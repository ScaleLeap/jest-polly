/** @jest-environment setup-polly-jest/jest-environment-node */
import { Polly } from '@pollyjs/core'

import { jestPollyConfigService, jestPollyContext } from '.'
import { JestPollyConfigService } from './config'

describe('index', () => {
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('exports polly instance', () => {
    expect.assertions(1)

    expect(jestPollyContext.polly).toBeInstanceOf(Polly)
  })

  it('exports polly config service', () => {
    expect.assertions(1)

    expect(jestPollyConfigService).toBeInstanceOf(JestPollyConfigService)
  })
})
