import Account from '../../../classes/account/Account'
import Credentials from '../../../classes/constants/Credentials'
import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import YamlHelper from '../../../classes/utilities/YamlHelper'

describe(Epic.Account, () => {
  const account = new Account()
  const yamlHelper = new YamlHelper('users')
  let auEResetPasswordUser

  before(() => {
    yamlHelper
      .read()
      .its('Users.prd.auEResetPassword')
      .then((data) => {
        auEResetPasswordUser = data
      })
  })

  context(Story.resetPassword, () => {
    it('Cw Normal User reset the password by email', () => {
      Story.ticket('QA-322')
      account.visitResetPassword()
      account.expectedResetPasswordFieldSubmitted(auEResetPasswordUser.email)
      account.expectedResetYourPasswordEmailWithLink(auEResetPasswordUser)
    })

    it('Cw Normal User change a new password', () => {
      Story.ticket('QA-324')
      cy.visit(account.getChangePasswordUrl())
      account.expectedPasswordChanged(Credentials.getPassword())
    })
  })
})
