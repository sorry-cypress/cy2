# cy2

Integrate Cypress with alternative cloud services like Sorry Cypress or Currents

---

**[Currents.dev](https://currents.dev/?utm_source=cy2)** - is a hosted cloud service used to run millions of Cypress tests without breaking the bank. This is an enhanced version of Sorry Cypress with better security, performance, analytics, integrations and support.

**[Sorry Cypress](https://sorry-cypress.dev/?utm_source=cy2)** - is an open-source, free alternative to Cypress Cloud that unlocks unlimited parallelization, test recordings, and integration with GitHub, Slack and more.

---

<p align="center">
  <img width="830" alt="banner dark" src="https://user-images.githubusercontent.com/1637928/147379205-2fe4fb9d-49e6-4a2b-917b-2a28973d2a3a.png">
</p>

![npm downloads](https://img.shields.io/npm/dw/cy2?style=flat)

`cy2` integrates [cypress](https://www.npmjs.com/package/cypress) with alternative orchestration services like Sorry Cypress or Currents.

[Changelog](./CHANGELOG.md) | [License GPL-3.0+](./LICENSE)

## Install

```sh
npm install cy2
```

## CLI Usage

Set the environment variable `CYPRESS_API_URL` and run `cy2`. The command passes down all the CLI flags to cypress runner as-is.

```sh
# use `http://localhost:1234` as orchestration cloud service
CYPRESS_API_URL="http://localhost:1234/" cy2 run --parallel --record --key somekey --ci-build-id hello-cypress
```

Example usage with [sorry-cypress](https://sorry-cypress.dev). The URL should point to `director` service.

```sh
CYPRESS_API_URL="https://sorry-cypress-demo-director.herokuapp.com" cy2 run  --parallel --record --key somekey --ci-build-id hello-cypress
```

## API

### `run`

Run Cypress via its [Module API](https://docs.cypress.io/guides/guides/module-api)

```ts
run(apiUrl: string, config: CypressCommandLine.CypressRunOptions): Promise<CypressCommandLine.CypressRunResult | CypressCommandLine.CypressFailedRunResult>
```

Example:

```ts
import { run } from 'cy2';

const results = await run('https://sorry-cypress.company.net', {
  reporter: 'junit',
  browser: 'chrome',
  config: {
    baseUrl: 'http://localhost:8080',
    video: true,
  },
});
```

### `spawn`

Spawn Cypress as a child process and inherit all the flags and environment variables. It invokes `process.exit` with the child process' exit code.

```ts
spawn(apiUrl: string): Promise<void>
```

Example:

```ts
import { spawn } from 'cy2';

await spawn(process.env.CYPRESS_API_URL);
```

## Breaking Changes

### Version 4

- `patch` method was deprecated. Use `run` instead.

### Version 3

- Starting version 3+, the API methods `run` and `patch` rely on `process.env.CYPRESS_API_URL` instead of accepting an argument. That's because of a new patching method that doesn't permanently change cypress configuration after invoking `cy2`.

### `patch` [deprecated in 4+]

> Deprecated due to the changes in cypress introduced in version 12+.

Change cypress configuration without running it.

```ts
patch(cypressPackageEntryPath: string) => Promise<void>
```

⚠️ Make sure to set `process.env.CYPRESS_API_URL` before invoking `patch`

Example:

```ts
import { patch } from 'cy2';
import cypress from 'cypress';

process.env.CYPRESS_API_URL = 'https://dashboard.service.url';

async function main() {
  // optional - provide cypress package main entry point location
  await patch(require.resolve('cypress'));

  cypress
    .run({
      // the path is relative to the current working directory
      spec: './cypress/e2e/examples/actions.cy.js',
    })
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {
      console.error(err);
    });
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```
