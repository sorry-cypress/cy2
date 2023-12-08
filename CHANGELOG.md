# Changelog


## [4.0.7](https://github.com/sorry-cypress/cy2/compare/v4.0.6...v4.0.7) (2023-12-08)


### Bug Fixes

* update expiring certificates ([9b817ec](https://github.com/sorry-cypress/cy2/commit/9b817ec5dccb7c877a8c8e5de608b11fe016591f))


## [4.0.6](https://github.com/sorry-cypress/cy2/compare/v4.0.5...v4.0.6) (2023-01-18)


### Bug Fixes

* Resolves Limit node engine to 14.17+  [#59](https://github.com/sorry-cypress/cy2/issues/59) ([#62](https://github.com/sorry-cypress/cy2/issues/62)) ([b7fb898](https://github.com/sorry-cypress/cy2/commit/b7fb898692e0b423756f91ab2673b2e461432a00))
* show package version in debug ([89c9fbd](https://github.com/sorry-cypress/cy2/commit/89c9fbdc70f1dfba50c843ef554aaceb5cc7ed7d))
* support NODE_EXTRA_CA_CERTS ([#61](https://github.com/sorry-cypress/cy2/issues/61)) ([66d0d66](https://github.com/sorry-cypress/cy2/commit/66d0d6666f632e05d6338dcc467f20cef3cacdeb))

## [4.0.5](https://github.com/sorry-cypress/cy2/compare/v4.0.4...v4.0.5) (2023-01-11)


### Bug Fixes

* use HTTPS_PROXY by default ([#56](https://github.com/sorry-cypress/cy2/issues/56)) ([c4115ca](https://github.com/sorry-cypress/cy2/commit/c4115ca1476cf8c06992437455e58bf903d591af))

## [4.0.4](https://github.com/sorry-cypress/cy2/compare/v4.0.3...v4.0.4) (2023-01-10)


### Bug Fixes

* Use the right upstream chain protocol ([#55](https://github.com/sorry-cypress/cy2/issues/55)) ([9a7bf20](https://github.com/sorry-cypress/cy2/commit/9a7bf20286b44d92867a67ed610208b6729f796b)), closes [#54](https://github.com/sorry-cypress/cy2/issues/54)

## [4.0.3](https://github.com/sorry-cypress/cy2/compare/v4.0.2...v4.0.3) (2023-01-09)

### Bug Fixes

- terminate proxy ([#53](https://github.com/sorry-cypress/cy2/issues/53)) ([12140cd](https://github.com/sorry-cypress/cy2/commit/12140cde58df9bea079950ce03ae69ca83dc34c8))

## [4.0.2](https://github.com/sorry-cypress/cy2/compare/v3.4.0...v4.0.2) (2023-01-09)

### Bug Fixes

- prevent populating env with "undefined" values ([#51](https://github.com/sorry-cypress/cy2/issues/51)) ([41df64f](https://github.com/sorry-cypress/cy2/commit/41df64f6c2118614485ae22e1a761d8bd42a3813))

## [4.0.1](https://github.com/sorry-cypress/cy2/compare/v3.4.0...v4.0.1) (2023-01-09)

Bumping version to skip the existing corrupted 4.0.0 on npm.

## [4.0.0](https://github.com/sorry-cypress/cy2/compare/v3.4.0...v4.0.0) (2023-01-09)

This release restores compatibility with Cypress 12 (as well as with the previous versions of Cypress).

### Features

- add sourcemaps to npm release ([ec90d0e](https://github.com/sorry-cypress/cy2/commit/ec90d0e954dd486d99710e9f6e80c342f2d9ba9b))
- add `run` API
- add `spawn` API

### BREAKING CHANGE

- Remove `patch` API - see [README](./README.md) for details
- Change the parameter types for `run` method - see [README](./README.md) for details

## [3.4.3](https://github.com/sorry-cypress/cy2/compare/v3.4.2...v3.4.3) (2022-12-12)

### Bug Fixes

- remove console message ([bb473d0](https://github.com/sorry-cypress/cy2/commit/bb473d0c363a6421d67531eb0c6a2aa651098dc0))

## [3.4.2](https://github.com/sorry-cypress/cy2/compare/v3.4.1...v3.4.2) (2022-12-12)

### Bug Fixes

- expose getBinPath ([ac576e7](https://github.com/sorry-cypress/cy2/commit/ac576e712b046b2c69fbebaba046505199ecf45e))

## [3.4.0](https://github.com/sorry-cypress/cy2/compare/v3.3.0...v3.4.0) (2022-12-10)

### Features

- cypress 12.0.2 ([7ecf9a2](https://github.com/sorry-cypress/cy2/commit/7ecf9a25b30cb8bcfa11fcead483a16749a9efc4))

## [3.3.0](https://github.com/sorry-cypress/cy2/compare/v3.2.0...v3.3.0) (2022-12-07)

### Features

- cypress 12+ ([a33868d](https://github.com/sorry-cypress/cy2/commit/a33868dfd2b811bdcd34f0194d42e2cadf6d3a31))

## [3.2.0](https://github.com/sorry-cypress/cy2/compare/v3.1.7...v3.2.0) (2022-11-11)

### Features

- monkey patch snapshot config ([1f379b0](https://github.com/sorry-cypress/cy2/commit/1f379b0dd7ceb541c729b4c438470e25495f8e43))

## [3.1.8-beta.0](https://github.com/sorry-cypress/cy2/compare/v3.1.7...v3.1.8-beta.0) (2022-11-11)

### Features

- monkey patch snapshot config ([d5a3fb9](https://github.com/sorry-cypress/cy2/commit/d5a3fb904dd95ea7f03e124cdbed713be0ac75b1))

## [3.1.7](https://github.com/sorry-cypress/cy2/compare/v3.1.6...v3.1.7) (2022-10-27)

### Bug Fixes

- handle windows paths ([add7e2f](https://github.com/sorry-cypress/cy2/commit/add7e2f41f078e68817560627e0ef3ffd9f64bdf))

## [3.1.6](https://github.com/sorry-cypress/cy2/compare/v3.1.5...v3.1.6) (2022-10-26)

### Bug Fixes

- normalize and resolve injected path ([da94405](https://github.com/sorry-cypress/cy2/commit/da94405b3953a9a2d065c3376b5fb5f999bdf04a))

## [3.1.5](https://github.com/sorry-cypress/cy2/compare/v3.1.4...v3.1.5) (2022-10-26)

### Bug Fixes

- use verbatim: 'raw' for escodegen ([78d9f2c](https://github.com/sorry-cypress/cy2/commit/78d9f2cd78cb0d491b6eb483898237dc639aeed1))

## [3.1.4](https://github.com/sorry-cypress/cy2/compare/v3.1.3...v3.1.4) (2022-10-24)

### Bug Fixes

- pass down exit status from cypress ([a6b1462](https://github.com/sorry-cypress/cy2/commit/a6b14623d11eaa4e445849a889ddbd66e190fc92)), closes [#27](https://github.com/sorry-cypress/cy2/issues/27)

## [3.1.3](https://github.com/sorry-cypress/cy2/compare/v3.1.2...v3.1.3) (2022-10-24)

### Bug Fixes

- add cypress location arg for patch fn ([163c5c4](https://github.com/sorry-cypress/cy2/commit/163c5c449072254fde3979f4733ff2db9dafebc6))

## [3.1.2](https://github.com/sorry-cypress/cy2/compare/v3.1.1...v3.1.2) (2022-10-21)

### Bug Fixes

- restore js-yaml dependency ([cc90c79](https://github.com/sorry-cypress/cy2/commit/cc90c7929e4e1ccc275a5b301ec60dbbde48fc37))

## [3.1.1](https://github.com/sorry-cypress/cy2/compare/v3.1.0...v3.1.1) (2022-10-21)

### Bug Fixes

- add label message ([d04d394](https://github.com/sorry-cypress/cy2/commit/d04d394d2f1b35d089a0e204b5e5261c9a00f5a7))

## [3.1.0](https://github.com/sorry-cypress/cy2/compare/v3.0.0...v3.1.0) (2022-10-21)

### Features

- expose API "inject" ([e8b9456](https://github.com/sorry-cypress/cy2/commit/e8b9456623229b72d0cdfed44ae682861cca2219))

## [3.0.0](https://github.com/sorry-cypress/cy2/compare/v3.0.0-alpha.2...v3.0.0) (2022-10-21)

Implement a new patching method that prevent permanent "patching" of cypress installation and causes confusion (and sometimes frustration)

### BREAKING CHANGES

- Starting version 3+, the API methods `run` and `patch` rely on `process.env.CYPRESS_API_URL` \* they do not accept any argument. That's because of a new patching method that doesn't permanently change cypress installation after invoking `cy2`.
- CLI executable script `cy2` requires CYPRESS_API_URL environment variable, otherwise throws
- Deprecated `run` API
- Deprecated CYPRESS_PACKAGE_CONFIG_PATH \* see API `patch` call

## [3.0.0-alpha.2](https://github.com/sorry-cypress/cy2/compare/v3.0.0-alpha.1...v3.0.0-alpha.2) (2022-10-21)

### Features

- implement patch and update README ([ad95e9d](https://github.com/sorry-cypress/cy2/commit/ad95e9d379138c77abaa8596452c14d90be73f51))

## [3.0.0-alpha.1](https://github.com/sorry-cypress/cy2/compare/v3.0.0-alpha.0...v3.0.0-alpha.1) (2022-10-20)

## [3.0.0-alpha.0](https://github.com/sorry-cypress/cy2/compare/v2.1.0...v3.0.0-alpha.0) (2022-10-20)

### Features

- allow init script injection ([113a58b](https://github.com/sorry-cypress/cy2/commit/113a58b8ec7dbf0c9d4f0e3d32d1f8140d634261))

### BREAKING CHANGES

- Starting version 3+, the API methods `run` and `patch` rely on `process.env.CYPRESS_API_URL` \* they do not accept any argument. That's because of a new patching method that doesn't permanently change cypress installation after invoking `cy2`.
- CLI executable script `cy2` requires CYPRESS_API_URL environment variable, otherwise throws

## [2.1.0](https://github.com/sorry-cypress/cy2/compare/v2.0.1...v2.1.0) (2022-10-19)

### Features

- restore original cypress config on exit ([64086da](https://github.com/sorry-cypress/cy2/commit/64086da4347ebdf28a87a281d8187e17bb927b65))

## [2.0.1](https://github.com/sorry-cypress/cy2/compare/v1.3.0...v2.0.1) (2022-08-28)

- 2.0.0 (#20) ([7846d42](https://github.com/sorry-cypress/cy2/commit/7846d42a2010398f41861fb0f6bf3f92be2b6999)), closes [#20](https://github.com/sorry-cypress/cy2/issues/20)

### BREAKING CHANGES

- bumping major for safe release, no API changes

- Release 2.0.0-beta.0

- Support CYPRESS_RUN_BINARY

- Release 2.0.0

## [2.0.0](https://github.com/sorry-cypress/cy2/compare/v2.0.0-beta.0...v2.0.0) (2022-03-29)

## [2.0.0-beta.0](https://github.com/sorry-cypress/cy2/compare/v1.3.0...v2.0.0-beta.0) (2021-09-12)

### Features

- add more discovery strategies ([f3d3b09](https://github.com/sorry-cypress/cy2/commit/f3d3b09e001578e768f7f1aac8932d57427e05c8))
- use CYPRESS_PACKAGE_CONFIG_PATH ([743a892](https://github.com/sorry-cypress/cy2/commit/743a892662aa9586ee52df2cdb6eee6479abdd7e))

### BREAKING CHANGES

- bumping major for safe release, no API changes

## [1.3.0](https://github.com/sorry-cypress/cy2/compare/v1.2.1...v1.3.0) (2021-09-08)

### Features

- add debug ([#15](https://github.com/sorry-cypress/cy2/issues/15)) ([c455cd5](https://github.com/sorry-cypress/cy2/commit/c455cd531f8ee3c255e81efae9de91a4065a6d40))
- use \_\_dirname instead of cwd ([#14](https://github.com/sorry-cypress/cy2/issues/14)) ([95561ea](https://github.com/sorry-cypress/cy2/commit/95561ea14362260be0dd6627f1697c3d86007d4d))

## [1.2.1](https://github.com/sorry-cypress/cy2/compare/v1.2.0...v1.2.1) (2021-05-11)

## [1.2.0](https://github.com/sorry-cypress/cy2/compare/v1.1.0...v1.2.0) (2021-05-11)

### Bug Fixes

- fix windows and add readme ([53adfad](https://github.com/sorry-cypress/cy2/commit/53adfad6fbc73902a34320966d53e2799e94b430))

### Features

- add e2e tests ([d3e45a1](https://github.com/sorry-cypress/cy2/commit/d3e45a16ea5b6afdf2252fb456157a2e1386a4fd))

## [1.1.0](https://github.com/sorry-cypress/cy2/compare/v1.1.0...v1.2.0) (2021-05-08)

### Features

- export run and patch from index ([e540940](https://github.com/sorry-cypress/cy2/commit/e5409406073064b7e00e50e19aff5a0662bf8324)), closes [#4](https://github.com/sorry-cypress/cy2/issues/4)

## [1.1.0-beta.0](https://github.com/sorry-cypress/cy2/compare/v1.1.0...v1.2.0) (2021-04-30)

### Features

- add `cy.patch(api)` export ([6712541](https://github.com/sorry-cypress/cy2/commit/6712541fb8e44580ec5f80d8758fbbaecbe29c11))

## [1.0.5](https://github.com/sorry-cypress/cy2/compare/v1.1.0...v1.2.0) (2021-04-30)

### Bug Fixes

- add trailing slash for the default url ([fa70900](https://github.com/sorry-cypress/cy2/commit/fa70900e50667c475614e6fe6105189f1f27bbe5))
- exit with child's exit code ([8a09906](https://github.com/sorry-cypress/cy2/commit/8a0990603d22d8cbad833b8efe68dd93a1437cac)), closes [#5](https://github.com/sorry-cypress/cy2/issues/5)
- spawn and inherit io ([7273f9d](https://github.com/sorry-cypress/cy2/commit/7273f9d97c81848aa5f87725b18486be15221b4e))