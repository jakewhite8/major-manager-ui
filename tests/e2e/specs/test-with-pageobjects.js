// //////////////////////////////////////////////////////////////
// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide
//
// For more information on working with page objects see:
//   https://nightwatchjs.org/guide/working-with-page-objects/
// //////////////////////////////////////////////////////////////

module.exports = {
  beforeEach: (browser) => browser.init(),

  'e2e tests using page objects': (browser) => {
    const homepage = browser.page.homepage();
    homepage.waitForElementVisible('@appContainer');

    const { app } = homepage.section;
    app.assert.elementCount('.fa-home', 1);
    app.expect.section('@navbar').to.be.visible;
    app.expect.section('@login').to.be.visible;

    browser.end();
  },

  // 'verify if string "e2e-nightwatch" is within the cli plugin links': (browser) => {
  //   const homepage = browser.page.homepage();
  //   const welcomeSection = homepage.section.app.section.welcome;

  //   welcomeSection.expect.element('@cliPluginLinks').text.to.contain('e2e-nightwatch');
  // },

  'Test reCAPTCHA': (browser) => {
    const registrationPage = browser.page.registrationPage();
    registrationPage.navigate()
    registrationPage.waitForElementVisible('@registrationContainer');

    const { form } = registrationPage.section;
    form.assert.elementCount('.recaptcha-container', 1);
    // Fill out registration page 
    registrationPage.setValue('input[name="team_name"]', 'team_name')
    registrationPage.setValue('input[name="email"]', 'email@email.com')
    registrationPage.setValue('input[name="password"]', 'password')
    registrationPage.setValue('input[name="password_confirmation"]', 'password')
    form.click('.recaptcha-container')
    // Submit form
    form.click('#registration-sign-up')
    // Error message should be displayed because nightwatch should not be able to 
    // pass Google reCAPTCHA test
    form.expect.section('#recaptcha-error-message').to.be.visible;
    // form.expect.section('@recaptchaErrorMessage').to.be.visible;
    registrationPage.getText('#recaptcha-error-message', function(result) {
      var errorMessage = result.value;
      registrationPage.assert.equal(errorMessage, 'Verify Intentions', 'Error message is not as expected')
    })

    browser.end();
  },
};
