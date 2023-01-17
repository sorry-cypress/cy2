describe('Test', function () {
  it(
    'Runs a test',
    {
      retries: 3,
    },
    function () {
      cy.visit('/');
    }
  );
});
