![](https://raw.githubusercontent.com/ScaleLeap/jest-polly/master/docs/assets/logo.png)

@scaleleap/jest-polly
=======================================

> Smoothest [Jest](https://github.com/facebook/jest) integration with [PollyJS](https://github.com/Netflix/pollyjs/).

* * *

Integrate Jest with PollyJS for a smooth experience of HTTP recording.

### List of features

 * Sane default [configuration](./src/config.ts)
 * TypeScript support

### Polly Mode

The [Polly mode](https://netflix.github.io/pollyjs/#/configuration?id=mode) can be set via `POLLY_MODE` environment variable.

Mode can be one of the following:

 * `replay`: Replay responses from recordings.
 * `record`: Force Polly to record all requests. This will overwrite recordings that already exist.
 * `passthrough`: Passes all requests through directly to the server without recording or replaying.

Usage:

```sh
POLLY_MODE=record npm t
```

### Code Demo

#### Use in all tests

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

#### Use in a single test

In `my.test.js`

```ts
import '@scaleleap/jest-polly';
import fetch from 'node-fetch';

test('is ok', async () => {
  const response = await fetch('https://httpstat.us/200');
  expect(response.ok).toBe(true);
});
```

#### Using the Polly instance

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

#### Change the Polly default config

If you want to change the default config, use the following setter.

**Note**: the config will be **merged** with the default config.

```ts
import { jestPollyConfigService } from '@scaleleap/jest-polly';

jestPollyConfigService.config = {
  matchRequestsBy: {
    order: false
  }
}
```

### Download & Installation

```shell
$ npm i @scaleleap/jest-polly
```

### Contributing

Keep it simple. Keep it minimal. Don't put every single feature just because you can.

### Authors or Acknowledgments

* Authored by Roman Filippov (Scale Leap)
* Inspired by [`@spotify/polly-jest-presets`](https://github.com/spotify/polly-jest-presets) but the project wasn't well maintained
* Inspired by [`@jomaxx/jest-polly`](https://github.com/jomaxx/jest-polly) but wasn't using `setup-polly-jest`

### License

This project is licensed under the MIT License
