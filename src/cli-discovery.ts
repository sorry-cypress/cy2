// const cliBinPath = await getCypressCLIBinPath();
//   const basePath = (await execute(`${cliBinPath} cache path`)).trim();
//   const version = (await execute(`${cliBinPath} --version`)).match(
//     /Cypress package version: (\S+)/
//   )[1];
// console.log({ path: path.trim() });
// console.log({ version: version.match(/Cypress package version: (\S+)/)[1] });

// /Users/agoldis/Library/Caches/Cypress/                8.3.0/Cypress.app/Contents/Resources/app/packages/server/config
// C:\Users\Administrator\AppData\Local\Cypress\Cache\   8.3.1\Cypress\resources\app\packages\server\config\

// const configFilePath = path.resolve(
//   `${basePath}/${version}/Cypress.app/Contents/Resources/app/packages/server/config/app.yml`
// );

// const backupConfigFilePath = configFilePath.replace('app.yml', '_app.yml');

// function execute(command) {
//   return new Promise((resolve, reject) => {
//     cp.exec(command, function (error, stdout, stderr) {
//       if (error) {
//         reject(error);
//       }
//       resolve(stdout);
//     });
//   });
// }
