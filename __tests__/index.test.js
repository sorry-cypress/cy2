const fs = require('fs');
const cy2 = require('../index');

test('index.patch', async () => {
  fs.writeFileSync = jest.fn();
  await cy2.patch('__cy2__some');
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    expect.any(String),
    expect.stringMatching(/.*__cy2__some.*/)
  );
});
