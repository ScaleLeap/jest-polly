import merge from 'lodash.merge'
import { isDefined } from 'ts-is-present'
import { JsonObject } from 'type-fest'

import { Secrets } from './config'

type NormalizedSecrets = Record<string, string>

export function replaceAll(string: string, secrets: NormalizedSecrets): string {
  let secretString = string

  for (const [secret, replacer] of Object.entries(secrets)) {
    secretString = secretString.split(secret).join(replacer)
  }

  return secretString
}

export function normalizeSecrets(secrets: Secrets): NormalizedSecrets {
  if (!Array.isArray(secrets)) {
    return secrets
  }

  const accumulator: NormalizedSecrets = {}

  secrets
    // eslint-disable-next-line unicorn/no-array-callback-reference
    .filter(isDefined) // removes undefines
    .filter((secret) => typeof secret === 'string' && !!secret) // non-empty string
    .forEach((secret) => Object.assign(accumulator, { [secret]: 'x' }))

  return accumulator
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function sanitize(recording: JsonObject, secrets: NormalizedSecrets): JsonObject {
  const accumulator: JsonObject = merge({}, recording)

  for (const key of Object.keys(recording)) {
    const value = accumulator[key]

    if (typeof value === 'string') {
      accumulator[key] = replaceAll(value, secrets)
    }

    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      accumulator[key] = sanitize(value, secrets)
    }

    if (Array.isArray(value)) {
      value.forEach((value_, index) => {
        if (typeof value_ === 'string') {
          value[index] = replaceAll(value_, secrets)
        }

        if (typeof value_ === 'object' && !Array.isArray(value_) && value_ !== null) {
          value[index] = sanitize(value_, secrets)
        }
      })
    }
  }

  return accumulator
}

export function secretSanitizer(recording: JsonObject, secrets: Secrets): JsonObject {
  return sanitize(merge({}, recording), normalizeSecrets(secrets))
}
