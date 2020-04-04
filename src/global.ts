import { Jasmine } from 'jest-jasmine2'

// https://stackoverflow.com/a/49479954/1566758
declare global {
  namespace NodeJS {
    interface Global {
      jasmine: Jasmine
    }
  }
}
