import Account from '../../../classes/account/Account'
import AccountUserStub from '../../../classes/account/stub/AccountUserStub'
import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'
import UserRole from '../../../classes/utilities/user-role/UserRole'

describe(Epic.Account, () => {
  let accountEmail = 'au_password_change@yopmail.com'
  let invalidEmail = 'Abc.example.com'
  const account = new Account()
  const errors = {
    invalidEmailError: 'Please enter a valid email address.',
  }

  context(Story.generalSettingAccountPasswordAndEmail, () => {
    before(() => {
      cy.stubUser(UserRole.WHITE_LABEL.AU_ESANTOS)
      cy.get('@stubUser').then((user) => {
        accountEmail = user.email
      })
      cy.readFile('cypress/fixtures/invalid-email.yaml').then((emailString) => {
        invalidEmail = YAML.parse(emailString).InvalidEmails.emails[0]
      })
    })
    beforeEach(() => {
      AccountUserStub.signInAsAuESantos(account.getAccountSettingUrl())
      account.getAccountEmailField()
    })

    it('Cw Normal User able to see account email screen and get validation', () => {
      Story.ticket('QA-1327')
      account.expectedAbleToSeeAccountEmail()
      account.expectedAbleToSeeCurrentUseOfAccountEmail(accountEmail)
      account.expectedInvalidEmailShowErrorMessage(invalidEmail, errors.invalidEmailError)
    })
  })
})
