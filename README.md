# cy2

[`cypress`](https://github.com/cypress-io/cypress) wrapper for setting API URL via environment variable `CYPRESS_API_URL`.

## Install

```sh
npm install cy2 cypress
```

## Usage

The wrapper just passes down arguments to `cypress` as is.

```sh

CYPRESS_API_URL="http://localhost:1234" cy2 open
```

Example usage with [sorry-cypress](https://sorry-cypress.dev)

```sh
CYPRESS_API_URL="https://sorry-cypress.domain.com" cy2 run  --parallel --record --key somekey --ci-build-id hello-cypress
```
