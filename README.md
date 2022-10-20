# cy2

![npm downloads](https://img.shields.io/npm/dw/cy2?style=flat)
[![AppVeyour](https://ci.appveyor.com/api/projects/status/8i4xhejvla6rhc3m/branch/master?svg=true)](https://ci.appveyor.com/project/agoldis/cy2/branch/master) [![CircleCI](https://circleci.com/gh/sorry-cypress/cy2/tree/master.svg?style=shield)](https://circleci.com/gh/sorry-cypress/cy2/tree/master)

---

<p align="center">
Run millions of cypress tests in parallel without breaking the bank
</p>

**[Currents.dev](https://currents.dev/?utm_source=cy2)** - is a hosted cloud service that hundreds of companies around the globe use to run **millions** of Cypress tests without breaking the bank. This is an enhanced version of Sorry Cypress with a better security, performance, analytics, integrations and support.

**[Sorry Cypress](https://sorry-cypress.dev/?utm_source=cy2)** is an open-source, free alternative to Cypress Dashboard that unlocks unlimited parallelization, test recordings, integration with GitHub, Slack and more.

---

Change cypress API URL configuration on-the-fly using environment variable `CYPRESS_API_URL`. It passes down all the CLI flags as-is, so you can just use it instead of cypress.

## Install

```sh
npm install cy2
```

## Usage

Use `http://localhost:1234` as Cypress API URL:

```sh
CYPRESS_API_URL="http://localhost:1234/" cy2 run --parallel --record --key somekey --ci-build-id hello-cypress
```

Example usage with [sorry-cypress](https://sorry-cypress.dev)

```sh
CYPRESS_API_URL="https://sorry-cypress-demo-director.herokuapp.com" cy2 run  --parallel --record --key somekey --ci-build-id hello-cypress
```

⚠️ `CYPRESS_API_URL` is required

## API

### Run Cypress with an injected module

```ts
import { run } from 'cy2';

run(`${__dirname}/injected.js`).catch((error) => {
  console.error(error);
  process.exit(1);
});
```

The injected module will be `require`d by cypress' NodeJS process before everything else. The value should be an absolute path to a compiled CommonJS module. Suitable for monkey-patching and overriding the default Cypress functionality.
