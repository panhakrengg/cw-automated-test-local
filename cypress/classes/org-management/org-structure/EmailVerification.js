import EmailHelper from '../../utilities/EmailHelper'

class EmailVerification {
  static emailHelper = new EmailHelper()

  static verifyDisabledEmail(email, name) {
    EmailVerification.emailHelper
      .getReceivedEmail('Your account has been disabled', email, true)
      .as('disabledEmail')
    cy.get('@disabledEmail').emailContains('Your account has been disabled')
    cy.get('@disabledEmail').emailContains(
      `Dear ${name},We would like to inform you that your account has been disabled for the time being.Thank you`
    )
  }
  static verifyEmailDisabled2Fa(email, name) {
    EmailVerification.emailHelper
      .getReceivedEmail('2-Step Verification is disabled', email, true)
      .as('disabled2FaEmail')
    cy.get('@disabled2FaEmail').emailContains('2-Step Verification is disabled')
    cy.get('@disabled2FaEmail').emailContains(
      `Dear ${name},We would like to inform you that 2-Step Verification for your account has been disabled.Thank you`
    )
  }
}

export default EmailVerification
