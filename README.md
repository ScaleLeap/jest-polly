# @scaleleap/jest-polly

![logo](https://raw.githubusercontent.com/ScaleLeap/jest-polly/master/docs/assets/logo.png)

> Smoothest Jest integration with PollyJS.

* * *

Integrate [Jest](https://github.com/facebook/jest) with [PollyJS](https://github.com/Netflix/pollyjs/)
for a smooth HTTP recording and playback experience for your integration tests.

## List of features

* Sane default [configuration](./src/config.ts#L16)
* Secret Sanitization
* TypeScript support

## Environment Variables

### [Polly Mode](https://netflix.github.io/pollyjs/#/configuration?id=mode)

Can be set via `POLLY_MODE` environment variable.

Mode can be one of the following:

* `replay`: Replay responses from recordings.
* `record`: Force Polly to record all requests. This will overwrite recordings that already exist.
* `passthrough`: Passes all requests through directly to the server without recording or replaying.

**Default**: `replay`

Usage:

```sh
POLLY_MODE=record npm t
```

### [Record if Missing](https://netflix.github.io/pollyjs/#/configuration?id=recordifmissing)

If a request's recording is not found, pass-through to the server and record the response.

Can be set via `POLLY_RECORD_IF_MISSING` environment variable.

**Default**: `false` if running in CI environment or `true` otherwise.

Usage:

```sh
POLLY_RECORD_IF_MISSING=true npm t
```

## Secret Sanitization

Sometimes requests and/or responses may contain secret data, such as API keys, or oAuth tokens.

To automatically sanitize the recordings, you may add a list of secrets to the config to be replaced.

See "Change PollyJS default config" section for details.

```ts
// use a Record-style config, where keys are secrets,
// and values are what they will be replaced with
jestPollyConfigService.config = {
  secrets: {
    'somepassword': 'x',
    'my-api-key': 'x',
  }
}

// or simply use an array, and everything will be replaced with `x` by default:
jestPollyConfigService.config = {
  secrets: [process.env.MY_SECRET_VALYE]
}
```

## Code Demo

### Use in all tests

In your `package.json`

```json
{
  "jest": {
    "setupFilesAfterEnv": ["@scaleleap/jest-polly"]
  }
}
```

Or in `jest.config.js`

```js
module.exports = {
  setupFilesAfterEnv: ['@scaleleap/jest-polly'],
};
```

### Use in a single test

In `my.test.js`

```ts
import '@scaleleap/jest-polly';
import fetch from 'node-fetch';

test('is ok', async () => {
  const response = await fetch('https://httpstat.us/200');
  expect(response.ok).toBe(true);
});
```

### Using the Polly instance

Use the [`polly` instance](https://netflix.github.io/pollyjs/#/api) to change default behavior.

```ts
import { jestPollyContext } from '@scaleleap/jest-polly';
import fetch from 'node-fetch';

jestPollyContext
  .polly
  .server
  .any('https://httpstat.us/500')
  .intercept((req, res) => res.sendStatus(500));

test('is not ok', async () => {
  const response = await fetch('https://httpstat.us/500');
  expect(response.ok).not.toBe(true);
});
```

### Change PollyJS default config

If you want to change the [default config](./src/config.ts#L16), use the following setter.

**Note**: the config will be **merged** with the default config, and **not** overwritten.

```ts
import { jestPollyConfigService } from '@scaleleap/jest-polly';

jestPollyConfigService.config = {
  matchRequestsBy: {
    order: false
  }
}
```

## Download & Installation

```sh
npm i -D @scaleleap/jest-polly
```

## Contributing

Keep it simple. Keep it minimal. Don't put every single feature just because you can.

## Authors or Acknowledgments

* Authored by Roman Filippov ([Scale Leap](https://www.scaleleap.com))
* Inspired by [`@spotify/polly-jest-presets`](https://github.com/spotify/polly-jest-presets),
  but the project wasn't well maintained
* Inspired by [`@jomaxx/jest-polly`](https://github.com/jomaxx/jest-polly), but wasn't using `setup-polly-jest`

## License

This project is licensed under the MIT License
