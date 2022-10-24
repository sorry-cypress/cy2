const { patch } = require('../../');

process.env.CYPRESS_API_URL = 'https://myURIhere.com';

async function main() {
  await patch();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
