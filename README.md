# cy2

![npm downloads](https://img.shields.io/npm/dw/cy2?style=flat)
[![AppVeyour](https://ci.appveyor.com/api/projects/status/8i4xhejvla6rhc3m/branch/master?svg=true)](https://ci.appveyor.com/project/agoldis/cy2/branch/master) [![CircleCI](https://circleci.com/gh/sorry-cypress/cy2/tree/master.svg?style=shield)](https://circleci.com/gh/sorry-cypress/cy2/tree/master)

---

Change cypress configuration to use an alternative dashboard service (Sorry Cypress or Currents).

---

<p align="center">
Run millions of cypress tests in parallel without breaking the bank
</p>

**[Currents.dev](https://currents.dev/?utm_source=cy2)** - is a hosted cloud service that hundreds of companies around the globe use to run **millions** of Cypress tests without breaking the bank. This is an enhanced version of Sorry Cypress with a better security, performance, analytics, integrations and support.

**[Sorry Cypress](https://sorry-cypress.dev/?utm_source=cy2)** is an open-source, free alternative to Cypress Dashboard that unlocks unlimited parallelization, test recordings, integration with GitHub, Slack and more.

---

`cy2` wil read the environment variable `CYPRESS_API_URL` and change cypress configuration accordingly. It passes down all the CLI flags **as-is** and runs cypress with all the flags.

`CYPRESS_API_URL` should point to Sorry Cypress director service, Currents dashboard or other compatible service.

## Install

```sh
npm install cy2
```

## Usage

CLI usage

```sh
# use `http://localhost:1234` as Cypress Dashboard
CYPRESS_API_URL="http://localhost:1234/" cy2 run --parallel --record --key somekey --ci-build-id hello-cypress
```

Example usage with [sorry-cypress](https://sorry-cypress.dev)

```sh
CYPRESS_API_URL="https://sorry-cypress-demo-director.herokuapp.com" cy2 run  --parallel --record --key somekey --ci-build-id hello-cypress
```

## API

### Breaking change in version 3+

Starting version 3+, the API methods `run` and `patch` rely on `process.env.CYPRESS_API_URL` instead of accepting an argument. That's because of a new patching method that doesn't permanently change cypress configuration after invoking `cy2`.

### Patch Cypress programmatically without running

`patch(cypressPackageEntryPath: string) => Promise<void>`

⚠️ Make sure to set `process.env.CYPRESS_API_URL` before invoking `patch`

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
