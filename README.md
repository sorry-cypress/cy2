# cy2

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
