import merge from 'lodash.merge'
import { JsonObject } from 'type-fest'

import { Secrets } from './config'

type NormalizedSecrets = Record<string, string>

export function replaceAll(string: string, secrets: NormalizedSecrets) {
  return Object.entries(secrets).reduce(
    (accumulator, [secret, replacer]) => accumulator.split(secret).join(replacer),
    string,
  )
}

export function normalizeSecrets(secrets: Secrets): NormalizedSecrets {
  if (!Array.isArray(secrets)) {
    return secrets
  }

  return secrets.reduce<NormalizedSecrets>((accumulator, secret) => {
    if (typeof secret === 'string' && !!secret) {
      return Object.assign(accumulator, { [secret]: 'x' })
    }

    return accumulator
  }, {})
}

export function sanitize(recording: JsonObject, secrets: NormalizedSecrets) {
  return Object.keys(recording).reduce((accumulator, key) => {
    const value = accumulator[key]

    if (typeof value === 'string') {
      accumulator[key] = replaceAll(value, secrets)
    }

    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      accumulator[key] = sanitize(value, secrets)
    }

    if (Array.isArray(value)) {
      value.forEach((value_, i) => {
        if (typeof value_ === 'string') {
          value[i] = replaceAll(value_, secrets)
        }

        if (typeof value_ === 'object' && !Array.isArray(value_) && value_ !== null) {
          value[i] = sanitize(value_, secrets)
        }
      })
    }

    return accumulator
  }, recording)
}

export function secretSanitizer(recording: JsonObject, secrets: Secrets) {
  return sanitize(merge({}, recording), normalizeSecrets(secrets))
}
