const devcert = require('devcert');
const https = require('https');

// create a CA
// run localhost https server with the CA
// cypress should reject the communication and do not accept the CA
// run cypress with concatenated CA
// set cypress base url to one of the servers

async function main() {
  let ssl = await devcert.certificateFor('api.cypress.io', {
    getCaPath: true,
    skipHostsFile: true,
    skipCertutil: true,
  });
  https
    .createServer(ssl, (req, res) => {
      res.end();
    })
    .listen(3000, () => {
      console.log('Listening on port 3000');
    });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
