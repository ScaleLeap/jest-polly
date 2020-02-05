import { Jasmine } from 'jest-jasmine2'
import { MODE } from '@pollyjs/core'

// https://stackoverflow.com/a/49479954/1566758
declare global {
  namespace NodeJS {
    interface Global {
      jasmine: Jasmine
    }

    interface ProcessEnv {
      POLLY_MODE?: MODE
    }
  }
}
