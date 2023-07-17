import Account2SV from '../../../classes/account/Account2SV'
import Credentials from '../../../classes/constants/Credentials'
import Epic from '../../../classes/Epic'
import SetupAuthentication from '../../../classes/register/SetupAuthentication'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Account, { retries: 1 }, () => {
  const accountPassword = Credentials.getPassword()
  const account2SV = new Account2SV()
  const twoFa = new SetupAuthentication()

  context(Story.twoStepAuthSetupAndConfiguration, () => {
    it('Cw Normal User able to see popup backup codes and generate codes', () => {
      Story.ticket('QA-1336')

      cy.logInTestCase('Delete backup code if exists')
      twoFa._itcFetch2StepVerification.set()
      SignInAs.backupCodeUser()
      cy.visit(account2SV.getTwoStepVerificationUrl())
      twoFa._itcFetch2StepVerification.wait()
      account2SV.deleteBackupCodesIfExists(accountPassword)

      account2SV.expectedBackupCodePopupOpens(accountPassword)
      account2SV.expectedValidPopupTitleAndDescription()
      account2SV.expectedValidGeneratedBackupCodes()
      account2SV.expectedBackupCodeNoteExists()
      account2SV.expectedBackupCodeDownloadButtonIsEnabled()
      account2SV.expectedGetCodesButtonExistsAfterClosePopup()
    })
  })
})
