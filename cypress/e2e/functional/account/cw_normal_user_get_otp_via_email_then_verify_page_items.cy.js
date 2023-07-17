import Account2SV from '../../../classes/account/Account2SV'
import Epic from '../../../classes/Epic'
import SetupAuthentication from '../../../classes/register/SetupAuthentication'
import Story from '../../../classes/Story'

describe(Epic.Account, () => {
  const setupAuthentication = new SetupAuthentication()
  const account2SV = new Account2SV()
  let otpCodeUser

  const sectionData = {
    authenticatorAppSection: {
      title: 'Authenticator App',
      description:
        'Use the Authenticator app to get free verification codes, even when your phone is offline.',
    },
    emailVerificationSection: {
      title: 'Email Verification',
      description: 'Set up your email to get verification codes.',
    },
    backupCodesSection: {
      title: 'Backup Codes',
      description:
        '10 single-use codes are active at this time, but you can generate more as needed.',
    },
  }

  before(() => {
    cy.readFile('cypress/fixtures/users.yaml').then((usersString) => {
      otpCodeUser = YAML.parse(usersString).Users.uat.otpCodeUser
    })
  })

  context(Story.twoStepAuthSetupAndConfiguration, () => {
    it('Cw Normal User setup 2SV app, email, backup code then use email verification code', () => {
      Story.ticket('QA-1335')
      setupAuthentication.checkLoginUsing2FaViaEmail(otpCodeUser)
    })

    it('Cw Normal User able to see a setup 2SV app, email, backup code', () => {
      Story.ticket('QA-125')
      setupAuthentication.checkLoginUsing2FaViaEmail(otpCodeUser)
      setupAuthentication.visitAccountSettingsAnd2StepVerification()
      account2SV.expectedTwoStepVerificationIsEnabled()
      account2SV.expectedAuthenticatorSectionIsValid(sectionData)
      account2SV.expectedEmailVerificationSectionIsValid(sectionData)
      account2SV.expectedBackupCodesSectionIsValid(sectionData)
    })
  })
})
