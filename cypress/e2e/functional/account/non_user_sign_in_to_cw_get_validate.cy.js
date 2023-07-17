import Epic from '../../../classes/Epic'
import Credentials from '../../../classes/constants/Credentials'
describe(Epic.Account, () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('Successful Sign in', () => {
    it('Redirect to Dashboard', () => {
      cy.visitThenSignIn('/u/home/dashboard', 'CWUsers.visa')
      cy.url().should('contain', '/u/home/dashboard')
    })
  })

  context('Show error when something wrong on Username', () => {
    it('Show error message when user not provide credentials', () => {
      cy.signInWith(' ', Credentials.getPassword())
      cy.get('.kc-feedback-text').should(
        'have.text',
        'Username or password is incorrect. Please try again or click on "Forgot Password" to reset your password.'
      )
    })
  })

  context('Show error when something wrong on password', () => {
    it('Show error message when user enter Wrong Password', () => {
      cy.signInWith('invalid@crosswired.com', 'wrongPassword')
      cy.get('.kc-feedback-text').should(
        'have.text',
        'Username or password is incorrect. Please try again or click on "Forgot Password" to reset your password.'
      )
    })
    it('Show error message when User Not Enter Password', () => {
      cy.signInWith('invalid@crosswired.com', '')
      cy.get('.gdpr--cookie-accept').click()
      cy.get('.kc-feedback-text').should(
        'have.text',
        'Username or password is incorrect. Please try again or click on "Forgot Password" to reset your password.'
      )
      cy.signInWith('invalid@crosswired.com', 'wrongPassword')
      cy.get('.kc-feedback-text').should(
        'have.text',
        'Username or password is incorrect. Please try again or click on "Forgot Password" to reset your password.'
      )
    })
  })
})
