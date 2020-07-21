import { normalizeSecrets, replaceAll, secretSanitizer } from './secrets-sanitizer'

describe('secrets', () => {
  describe(`${replaceAll.name}`, () => {
    it('should replace nothing if empty secrets are given', () => {
      expect.assertions(1)

      expect(replaceAll('foo', {})).toBe('foo')
    })

    it('should replace one secret', () => {
      expect.assertions(1)

      expect(replaceAll('foo iamseret bar', { iamseret: 'x' })).toBe('foo x bar')
    })

    it('should replace two secrets', () => {
      expect.assertions(1)

      const secrets = {
        iamseret: 'x',
        anothersecret: 'y',
      }

      expect(replaceAll('foo iamseret bar anothersecret baz', secrets)).toBe('foo x bar y baz')
    })
  })

  describe(`${normalizeSecrets.name}`, () => {
    it('should normalize array', () => {
      expect.assertions(1)

      const normalized = normalizeSecrets(['a', 'b'])

      expect(normalized).toStrictEqual({
        a: 'x',
        b: 'x',
      })
    })

    it('should return record-style secret param as is', () => {
      expect.assertions(1)

      const secrets = {
        a: 'x',
        b: 'x',
      }

      expect(normalizeSecrets(secrets)).toStrictEqual(secrets)
    })
  })

  describe(`${secretSanitizer.name}`, () => {
    const secrets = {
      iamasecret: 'x',
      anothersecret: 'x',
    }

    it('should replace all secrets and leave other params', () => {
      expect.assertions(1)

      const recording = {
        foo: '1 iamasecret 1',
        bar: {
          // eslint-disable-next-line unicorn/no-null
          null: null,
          baz: {
            foo: true,
            val: '1 anothersecret 1 anothersecret x',
          },
        },
        array: [
          {
            name: 'foo',
            value: 'iamasecret',
          },
        ],
        arrayOfStrings: ['iamasecret', 'y'],
      }

      expect(secretSanitizer(recording, secrets)).toMatchSnapshot()
    })
  })
})
