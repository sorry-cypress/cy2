# [3.4.0](https://github.com/sorry-cypress/cy2/compare/v3.3.0...v3.4.0) (2022-12-10)


### Features

* cypress 12.0.2 ([7ecf9a2](https://github.com/sorry-cypress/cy2/commit/7ecf9a25b30cb8bcfa11fcead483a16749a9efc4))

# [3.3.0](https://github.com/sorry-cypress/cy2/compare/v3.2.0...v3.3.0) (2022-12-07)


### Features

* cypress 12+ ([a33868d](https://github.com/sorry-cypress/cy2/commit/a33868dfd2b811bdcd34f0194d42e2cadf6d3a31))

# [3.2.0](https://github.com/sorry-cypress/cy2/compare/v3.1.7...v3.2.0) (2022-11-11)


### Features

* monkey patch snapshot config ([1f379b0](https://github.com/sorry-cypress/cy2/commit/1f379b0dd7ceb541c729b4c438470e25495f8e43))

## [3.1.8-beta.0](https://github.com/sorry-cypress/cy2/compare/v3.1.7...v3.1.8-beta.0) (2022-11-11)


### Features

* monkey patch snapshot config ([d5a3fb9](https://github.com/sorry-cypress/cy2/commit/d5a3fb904dd95ea7f03e124cdbed713be0ac75b1))

## [3.1.7](https://github.com/sorry-cypress/cy2/compare/v3.1.6...v3.1.7) (2022-10-27)


### Bug Fixes

* handle windows paths ([add7e2f](https://github.com/sorry-cypress/cy2/commit/add7e2f41f078e68817560627e0ef3ffd9f64bdf))

## [3.1.6](https://github.com/sorry-cypress/cy2/compare/v3.1.5...v3.1.6) (2022-10-26)


### Bug Fixes

* normalize and resolve injected path ([da94405](https://github.com/sorry-cypress/cy2/commit/da94405b3953a9a2d065c3376b5fb5f999bdf04a))

## [3.1.5](https://github.com/sorry-cypress/cy2/compare/v3.1.4...v3.1.5) (2022-10-26)


### Bug Fixes

* use verbatim: 'raw' for escodegen ([78d9f2c](https://github.com/sorry-cypress/cy2/commit/78d9f2cd78cb0d491b6eb483898237dc639aeed1))

## [3.1.4](https://github.com/sorry-cypress/cy2/compare/v3.1.3...v3.1.4) (2022-10-24)


### Bug Fixes

* pass down exit status from cypress ([a6b1462](https://github.com/sorry-cypress/cy2/commit/a6b14623d11eaa4e445849a889ddbd66e190fc92)), closes [#27](https://github.com/sorry-cypress/cy2/issues/27)

## [3.1.3](https://github.com/sorry-cypress/cy2/compare/v3.1.2...v3.1.3) (2022-10-24)


### Bug Fixes

* add cypress location arg for patch fn ([163c5c4](https://github.com/sorry-cypress/cy2/commit/163c5c449072254fde3979f4733ff2db9dafebc6))

## [3.1.2](https://github.com/sorry-cypress/cy2/compare/v3.1.1...v3.1.2) (2022-10-21)

### Bug Fixes

- restore js-yaml dependency ([cc90c79](https://github.com/sorry-cypress/cy2/commit/cc90c7929e4e1ccc275a5b301ec60dbbde48fc37))

## [3.1.1](https://github.com/sorry-cypress/cy2/compare/v3.1.0...v3.1.1) (2022-10-21)

### Bug Fixes

- add label message ([d04d394](https://github.com/sorry-cypress/cy2/commit/d04d394d2f1b35d089a0e204b5e5261c9a00f5a7))

# [3.1.0](https://github.com/sorry-cypress/cy2/compare/v3.0.0...v3.1.0) (2022-10-21)

### Features

- expose API "inject" ([e8b9456](https://github.com/sorry-cypress/cy2/commit/e8b9456623229b72d0cdfed44ae682861cca2219))

# [3.0.0](https://github.com/sorry-cypress/cy2/compare/v3.0.0-alpha.2...v3.0.0) (2022-10-21)

Implement a new patching method that prevent permanent "patching" of cypress installation and causes confusion (and sometimes frustration)

### BREAKING CHANGES

- Starting version 3+, the API methods `run` and `patch` rely on `process.env.CYPRESS_API_URL` - they do not accept any argument. That's because of a new patching method that doesn't permanently change cypress installation after invoking `cy2`.
- CLI executable script `cy2` requires CYPRESS_API_URL environment variable, otherwise throws
- Deprecated `run` API
- Deprecated CYPRESS_PACKAGE_CONFIG_PATH - see API `patch` call

# [3.0.0-alpha.2](https://github.com/sorry-cypress/cy2/compare/v3.0.0-alpha.1...v3.0.0-alpha.2) (2022-10-21)

### Features

- implement patch and update README ([ad95e9d](https://github.com/sorry-cypress/cy2/commit/ad95e9d379138c77abaa8596452c14d90be73f51))

# [3.0.0-alpha.1](https://github.com/sorry-cypress/cy2/compare/v3.0.0-alpha.0...v3.0.0-alpha.1) (2022-10-20)

# [3.0.0-alpha.0](https://github.com/sorry-cypress/cy2/compare/v2.1.0...v3.0.0-alpha.0) (2022-10-20)

### Features

- allow init script injection ([113a58b](https://github.com/sorry-cypress/cy2/commit/113a58b8ec7dbf0c9d4f0e3d32d1f8140d634261))

### BREAKING CHANGES

- Starting version 3+, the API methods `run` and `patch` rely on `process.env.CYPRESS_API_URL` - they do not accept any argument. That's because of a new patching method that doesn't permanently change cypress installation after invoking `cy2`.
- CLI executable script `cy2` requires CYPRESS_API_URL environment variable, otherwise throws

# [2.1.0](https://github.com/sorry-cypress/cy2/compare/v2.0.1...v2.1.0) (2022-10-19)

### Features

- restore original cypress config on exit ([64086da](https://github.com/sorry-cypress/cy2/commit/64086da4347ebdf28a87a281d8187e17bb927b65))

## [2.0.1](https://github.com/sorry-cypress/cy2/compare/v1.3.0...v2.0.1) (2022-08-28)

- 2.0.0 (#20) ([7846d42](https://github.com/sorry-cypress/cy2/commit/7846d42a2010398f41861fb0f6bf3f92be2b6999)), closes [#20](https://github.com/sorry-cypress/cy2/issues/20)

### BREAKING CHANGES

- bumping major for safe release, no API changes

- Release 2.0.0-beta.0

- Support CYPRESS_RUN_BINARY

- Release 2.0.0

# [2.0.0](https://github.com/sorry-cypress/cy2/compare/v2.0.0-beta.0...v2.0.0) (2022-03-29)

# [2.0.0-beta.0](https://github.com/sorry-cypress/cy2/compare/v1.3.0...v2.0.0-beta.0) (2021-09-12)

### Features

- add more discovery strategies ([f3d3b09](https://github.com/sorry-cypress/cy2/commit/f3d3b09e001578e768f7f1aac8932d57427e05c8))
- use CYPRESS_PACKAGE_CONFIG_PATH ([743a892](https://github.com/sorry-cypress/cy2/commit/743a892662aa9586ee52df2cdb6eee6479abdd7e))

### BREAKING CHANGES

- bumping major for safe release, no API changes

# [1.3.0](https://github.com/sorry-cypress/cy2/compare/v1.2.1...v1.3.0) (2021-09-08)

### Features

- add debug ([#15](https://github.com/sorry-cypress/cy2/issues/15)) ([c455cd5](https://github.com/sorry-cypress/cy2/commit/c455cd531f8ee3c255e81efae9de91a4065a6d40))
- use \_\_dirname instead of cwd ([#14](https://github.com/sorry-cypress/cy2/issues/14)) ([95561ea](https://github.com/sorry-cypress/cy2/commit/95561ea14362260be0dd6627f1697c3d86007d4d))

## [1.2.1](https://github.com/sorry-cypress/cy2/compare/v1.2.0...v1.2.1) (2021-05-11)

# [1.2.0](https://github.com/sorry-cypress/cy2/compare/v1.1.0...v1.2.0) (2021-05-11)

### Bug Fixes

- fix windows and add readme ([53adfad](https://github.com/sorry-cypress/cy2/commit/53adfad6fbc73902a34320966d53e2799e94b430))

### Features

- add e2e tests ([d3e45a1](https://github.com/sorry-cypress/cy2/commit/d3e45a16ea5b6afdf2252fb456157a2e1386a4fd))

# [1.1.0](https://github.com/sorry-cypress/cy2/compare/v1.1.0...v1.2.0) (2021-05-08)

### Features

- export run and patch from index ([e540940](https://github.com/sorry-cypress/cy2/commit/e5409406073064b7e00e50e19aff5a0662bf8324)), closes [#4](https://github.com/sorry-cypress/cy2/issues/4)

# [1.1.0-beta.0](https://github.com/sorry-cypress/cy2/compare/v1.1.0...v1.2.0) (2021-04-30)

### Features

- add `cy.patch(api)` export ([6712541](https://github.com/sorry-cypress/cy2/commit/6712541fb8e44580ec5f80d8758fbbaecbe29c11))

## [1.0.5](https://github.com/sorry-cypress/cy2/compare/v1.1.0...v1.2.0) (2021-04-30)

### Bug Fixes

- add trailing slash for the default url ([fa70900](https://github.com/sorry-cypress/cy2/commit/fa70900e50667c475614e6fe6105189f1f27bbe5))
- exit with child's exit code ([8a09906](https://github.com/sorry-cypress/cy2/commit/8a0990603d22d8cbad833b8efe68dd93a1437cac)), closes [#5](https://github.com/sorry-cypress/cy2/issues/5)
- spawn and inherit io ([7273f9d](https://github.com/sorry-cypress/cy2/commit/7273f9d97c81848aa5f87725b18486be15221b4e))
