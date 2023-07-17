import Account from '../../../classes/account/Account'
import AccountUserStub from '../../../classes/account/stub/AccountUserStub'
import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import UserRole from '../../../classes/utilities/user-role/UserRole'

describe(Epic.Account, () => {
  let userEmail = ''
  const account = new Account()
  const errors = {
    passwordMustMatchError: 'Please try again - Passwords must match',
    passwordLengthError: 'Password must be at least 8 characters long.',
    passwordSpecialCharacterError:
      'Password must have at least one upper case letter, one lower case letter, one number, and one special character.',
  }

  context(Story.generalSettingAccountPasswordAndEmail, () => {
    before(() => {
      cy.stubUser(UserRole.WHITE_LABEL.AU_ESANTOS)
      cy.get('@stubUser').then((user) => {
        userEmail = user.email
      })
    })

    it('Cw Normal User able to see account password and get validation', () => {
      Story.ticket('QA-1325')
      AccountUserStub.signInAsAuESantos(account.getAccountSettingUrl())
      account.getPasswordFields()
      account.expectedShortPasswordError(errors.passwordLengthError)
      account.expectedWrongPasswordError(errors.passwordSpecialCharacterError)
      account.expectedPasswordMustMatchError(errors.passwordMustMatchError)
    })
  })
})
