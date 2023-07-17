import Account from '../../../classes/account/Account'
import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'

describe(Epic.Account, () => {
  const account = new Account()

  context(Story.generalSettingLanguage, () => {
    it('Non-Cw User able to see the reset password screen and get validation email', () => {
      Story.ticket('QA-319')
      account.visitResetPassword()
      account.expectedTitleAndDescriptionAreVisible()
      account.expectedUsernameFieldShowErrorMessageWhenEmpty()
      account.expectedBackToSignInGoesToLoginScreen()
    })
  })
})
