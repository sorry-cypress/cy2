# cy2

![npm downloads](https://img.shields.io/npm/dw/cy2?style=flat)
[![AppVeyour](https://ci.appveyor.com/api/projects/status/8i4xhejvla6rhc3m/branch/master?svg=true)](https://ci.appveyor.com/project/agoldis/cy2/branch/master) [![CircleCI](https://circleci.com/gh/sorry-cypress/cy2/tree/master.svg?style=shield)](https://circleci.com/gh/sorry-cypress/cy2/tree/master)

Change cypress API URL configuration on-the-fly using environment variable `CYPRESS_API_URL`. It passes down all the CLI flags as-is, so you can just use it instead of cypress.

## Install

```sh
npm install cy2
```

---

## Usage

Use `http://localhost:1234` as Cypress API URL:

```sh
CYPRESS_API_URL="http://localhost:1234/" cy2 run --parallel --record --key somekey --ci-build-id hello-cypress
```

Example usage with [sorry-cypress](https://sorry-cypress.dev)

```sh
CYPRESS_API_URL="https://sorry-cypress-demo-director.herokuapp.com" cy2 run  --parallel --record --key somekey --ci-build-id hello-cypress
```

When `CYPRESS_API_URL` is not set, it just uses the default API server `https://api.cypress.io`

---

## API

### Patch Cypress

```ts
/**
 * Patch Cypress with a custom API URL.
 *
 * Tries to discover the location of `app.yml`
 * and patch it with a custom URL.
 *
 * https://github.com/cypress-io/cypress/blob/develop/packages/server/config/app.yml
 *
 * @param {string} apiURL - new API URL to use
 * @param {string} [cypressConfigFilePath] - explicitly provide the path to Cypress app.yml and disable auto-discovery
 */
patch(apiURL: string, cypressConfigPath?: string) => Promise<void>
```

Example

```js
const { patch } = require('cy2');

async function main() {
  await patch('https://sorry-cypress-demo-director.herokuapp.com');
}

main().catch(console.error);
```

### Patch and run cypress

```ts
/**
 * Run Cypress programmatically as a child process
 */
run(apiURL?: string = 'https://api.cypress.io/'), label?: string = 'cy2')=> Promise<void>
```

Example

```js
#!/usr/bin/env node

/* cmd.js */

const { run } = require('cy2');

async function main() {
  await run('https://sorry-cypress-demo-director.herokuapp.com/', 'myCMD');
}

main().catch(console.error);
/*

$ ./cmd.js --help
[myCMD] Running cypress with API URL: https://sorry-cypress-demo-director.herokuapp.com/
Usage: cypress <command> [options]

Options:
  -v, --version      prints Cypress version
  -h, --help         display help for command

*/
```

---

## Explicit config file location (since 1.4.0)

Sometimes `cy2` is not able to automatically detect the location of cypress package on your system. In that case you should explicitly provide environment variable `CYPRESS_PACKAGE_CONFIG_PATH` with the location of cypress's `app.yml` configuration file.

Example:

```sh
CYPRESS_API_URL="http://localhost:1234/" \
CYPRESS_PACKAGE_CONFIG_PATH="/Users/John/Cypress/8.3.0/Cypress.app/Contents/Resources/app/packages/server/config/app.yml" \
DEBUG=cy2* yarn cy2 run --parallel --record --key somekey --ci-build-id hello-cypress
```

See [cypress agent configuration](https://docs.sorry-cypress.dev/cypress-agent/configuring-cypress-agent) for locating `app.yml` file on your system.
