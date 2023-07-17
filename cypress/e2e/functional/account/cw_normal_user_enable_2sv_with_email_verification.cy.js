import Account2SV from '../../../classes/account/Account2SV'
import Credentials from '../../../classes/constants/Credentials'
import Epic from '../../../classes/Epic'
import SetupAuthentication from '../../../classes/register/SetupAuthentication'
import Story from '../../../classes/Story'

describe(Epic.Account, { retries: 1 }, () => {
  const setupAuthentication = new SetupAuthentication()
  const account2SV = new Account2SV()
  const accountPassword = Credentials.getPassword()
  const TWO_FACTOR_PATH_NAME = Cypress.env('loginPath')
  let getOtpCodeUser

  before(() => {
    cy.readFile('cypress/fixtures/users.yaml').then((usersString) => {
      getOtpCodeUser = YAML.parse(usersString).Users.uat.getOtpCodeUser
    })
  })

  context(Story.twoStepAuthSetupAndConfiguration, () => {
    it('Cw Normal User enable 2SV with email verification', () => {
      Story.ticket('QA-117')
      cy.signInViaEmail(getOtpCodeUser['email'], getOtpCodeUser['screenName'])
      cy.location('pathname')
        .then(($pathName) => {
          if ($pathName == TWO_FACTOR_PATH_NAME) {
            setupAuthentication.enterTwoFactorCode(getOtpCodeUser)
            setupAuthentication.visitAccountSettingsAnd2StepVerification()
            setupAuthentication.disable2FA()
            setupAuthentication.remove2FAEmailMethodVerification()
          }
        })
        .then(() => {
          setupAuthentication.visitAccountSettingsAnd2StepVerification()
          account2SV.expectedSetupEmailAuthenticationVerified(
            accountPassword,
            setupAuthentication._itcFetch2StepVerification
          )
          cy.signOut()
          setupAuthentication.checkLoginUsing2FaViaEmail(getOtpCodeUser)
        })

      setupAuthentication.visitAccountSettingsAnd2StepVerification()
      account2SV.deleteEmailAuthenticationMethod(accountPassword)
    })
  })
})
