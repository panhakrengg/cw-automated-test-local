import Account from '../../../classes/account/Account'
import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'

describe(Epic.Account, () => {
  const account = new Account()
  const objInvalidResetPassword = {
    label: 'Invalid Reset Pass User',
    email: 'invalid_reset_pass@yopmail.com',
    screenName: 'invalid_reset_pass',
  }

  context(Story.resetPassword, () => {
    it('Non-Cw User fill in email reset field & click resend password in CW but the email will not send out', () => {
      Story.ticket('QA-321')
      account.visitResetPassword()
      account.expectedFillInNonCwEmailAndSendLinkToEmail(objInvalidResetPassword.email)
      account.expectedResetPasswordEmailNotArrive(objInvalidResetPassword)
    })
  })
})
