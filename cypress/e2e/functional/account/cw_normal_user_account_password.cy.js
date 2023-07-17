import Account from '../../../classes/account/Account'
import Credentials from '../../../classes/constants/Credentials'
import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'
import UserRole from '../../../classes/utilities/user-role/UserRole'

describe(Epic.Account, { retries: 1 }, () => {
  const currentPassword = Credentials.getPassword()
  const newPassword = 'Welcome.02'
  let userEmail = 'au_password_change@yopmail.com'
  const account = new Account()

  context(Story.generalSettingAccountPasswordAndEmail, () => {
    before(() => {
      cy.stubUser(UserRole.CW_USERS.PASSWORD_CHANGE_USER)
      cy.get('@stubUser').then((user) => {
        userEmail = user.email
      })
    })

    function resetBackToOldPassword(account, newPassword, currentPassword) {
      account.visitAccountSettings()
      account.getPasswordFields()
      account.savePassword(newPassword, currentPassword)
    }

    it('Cw Normal User change account password then login successfully', () => {
      Story.ticket('QA-1326')
      if (Cypress.currentRetry == 1) {
        cy.visit(Cypress.config('baseUrl'))
        cy.signInWith(userEmail, newPassword)
        resetBackToOldPassword(account, newPassword, currentPassword)
      }

      SignInAs.passwordChangeUser(account.getAccountSettingUrl())
      account.getPasswordFields()
      account.savePassword(currentPassword, newPassword)
      account.expectedCanAccessDashboard()
      cy.signOut()

      cy.logInTestCase('Verify login with new password ')
      account.expectedSignInWithWrongPasswordShowErrorMessage(currentPassword, userEmail)
      account.expectedLoginSuccessfully(newPassword, userEmail)

      cy.logInTestCase('Reset password back to old password')
      resetBackToOldPassword(account, newPassword, currentPassword)
    })
  })
})
