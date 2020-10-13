import { MODE } from '@pollyjs/core'
import { isCI } from 'ci-info'
import { get } from 'env-var'

const POLLY_MODES: MODE[] = ['replay', 'record', 'passthrough', 'stopped']

export const POLLY_MODE = get('POLLY_MODE').default(POLLY_MODES[0]).asEnum<MODE>(POLLY_MODES)

export const POLLY_RECORD_IF_MISSING = get('POLLY_RECORD_IF_MISSING')
  .default(isCI ? 'false' : 'true')
  .asBoolStrict()
