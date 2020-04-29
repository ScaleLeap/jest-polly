import { MODE } from '@pollyjs/core'
import { BaseConfig } from '@scaleleap/config'
import { isCI } from 'ci-info'

const POLLY_MODES: MODE[] = ['replay', 'record', 'passthrough', 'stopped']

class Config extends BaseConfig {
  readonly POLLY_MODE = this.get('POLLY_MODE').default(POLLY_MODES[0]).asEnum(POLLY_MODES) as MODE

  readonly POLLY_RECORD_IF_MISSING = this.get('POLLY_RECORD_IF_MISSING')
    .default(isCI ? 'false' : 'true')
    .asBoolStrict()
}

export const environment = new Config()
