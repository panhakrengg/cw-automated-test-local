import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import Account from '../../../classes/account/Account'
import Field from '../../../classes/constants/Field'
import YamlHelper from '../../../classes/utilities/YamlHelper'

describe(Epic.Account, { retries: 1 }, () => {
  const account = new Account()
  const userYaml = new YamlHelper('users')
  const LOGIN_PATH = Cypress.env('loginPath')
  let firstEmail
  let secondEmail
  let screenName
  let user

  before(() => {
    userYaml
      .read()
      .its('Users.prd')
      .then((data) => {
        user = data.auFireCloudReplace1
        screenName = user['screenName']
        firstEmail = user['email']
        secondEmail = user['secondEmail']
      })
  })

  context(Story.generalSettingAccountPasswordAndEmail, () => {
    it('Cw Normal User change account email then login successfully', () => {
      Story.ticket('QA-1331')
      cy.signInViaEmail(firstEmail, screenName)
      cy.location('pathname')
        .then(($pathName) => {
          if ($pathName == LOGIN_PATH) {
            cy.signInViaEmail(secondEmail, screenName)
            firstEmail = user['secondEmail']
            secondEmail = user['email']
          }
        })
        .then(() => {
          context('Change new email', () => {
            account.visitAccountSettings()
            account.inputNewEmailAddress(secondEmail)
            account.clickSaveChangeNewEmailAddress()
          })

          context('Verify UI after click save new email', () => {
            account.verifyVerificationEmailUI(firstEmail, secondEmail)
          })

          context('Get and Enter verification code', () => {
            account.getVerificationCodeToChangeEmail(secondEmail)
            cy.get('@verificationCode').then(($verifyCode) => {
              account.inputChangeEmailVerificationCode($verifyCode)
              cy.clickButtonByName(Field.CONFIRM)
            })
            cy.waitLoadingOverlayNotExist()
            cy.reload() //Issue: can't change account email and it's suppose to auto reload so remove this after issue is fixed
          })

          context('Expected to see new account email', () => {
            account.verifyCurrentAccountEmail(secondEmail)
          })

          context('Reset data', () => {
            account.inputNewEmailAddress(firstEmail)
            account.clickSaveChangeNewEmailAddress()
            account.getVerificationCodeToChangeEmail(firstEmail)
            cy.get('@verificationCode').then(($verifyCode) => {
              account.inputChangeEmailVerificationCode($verifyCode)
              account._itcModifyAccountSettings.set()
              cy.clickButtonByName(Field.CONFIRM)
              account._itcModifyAccountSettings.wait()
            })
          })
        })
    })
  })
})
