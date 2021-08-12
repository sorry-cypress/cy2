# cy2

![npm downloads](https://img.shields.io/npm/dw/cy2?style=flat)
[![AppVeyour](https://ci.appveyor.com/api/projects/status/8i4xhejvla6rhc3m/branch/master?svg=true)](https://ci.appveyor.com/project/agoldis/cy2/branch/master) [![CircleCI](https://circleci.com/gh/sorry-cypress/cy2/tree/master.svg?style=shield)](https://circleci.com/gh/sorry-cypress/cy2/tree/master)

Change cypress API URL configuration on-the-fly using environment variable `CYPRESS_API_URL`. It passes down all the CLI flags as-is, so you can just use it instead of cypress.

## Install

```sh
npm install cy2
```

## Usage

```sh

CYPRESS_API_URL="http://localhost:1234/" cy2 open
```

Example usage with [sorry-cypress](https://sorry-cypress.dev)

```sh
CYPRESS_API_URL="https://sorry-cypress.domain.com" cy2 run  --parallel --record --key somekey --ci-build-id hello-cypress
```

When `CYPRESS_API_URL` is not available, it just uses the default API server.

## API

Patch `cypress` package

```ts
patch(apiURL: string) => Promise<void>
```

Patch and run `cypress`

```ts
run(apiURL?: string = 'https://yourserver.io/'), label?: string = 'cy2')=> Promise<void>
```

### Examples

```js
const { patch } = require('cy2');

async function main() {
  await patch('https://sorry-cypress-demo-director.herokuapp.com');
}

main().catch(console.error);
```

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
