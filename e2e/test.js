const { patch } = require('../../');

const CYPRESS_API_URL = 'https://myURIhere.com';

async function main() {
  await patch(CYPRESS_API_URL);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
