import Credentials from '../constants/Credentials'
class Register {
  personal(user) {
    cy.get('.d-sm-flex > :nth-child(3)').click()
    cy.get(':nth-child(3) > :nth-child(2) > .form-group > div > .field').type(user.givenName)
    cy.get(':nth-child(3) > .form-group > div > .field').type(user.familyName)
    cy.get(':nth-child(4) > :nth-child(1) > .form-group > :nth-child(2) > .field').type(
      user.screenName
    )
    cy.get(':nth-child(4) > :nth-child(2) > .form-group > div > .field').type('2002-02-02')
    cy.wait(100)
    cy.get(':nth-child(5) > :nth-child(1) > .form-group > div > .field').type(user.email)
    cy.get(':nth-child(5) > :nth-child(2) > .form-group > div > .field').type(user.email)
    cy.get(':nth-child(6) > :nth-child(1) > .form-group > div > .field').type(
      Credentials.getPassword(),
      { log: false }
    )
    cy.get(':nth-child(6) > :nth-child(2) > .form-group > div > .field').type(
      Credentials.getPassword(),
      { log: false }
    )
    cy.get('#_registration_crosswired-consent-form0').click()
    cy.get('.mb-3 > .btn').click()
  }

  byCoupon() {
    cy.get(':nth-child(3) > .cec-card > .cec-card__body > .align-items-baseline > input').click()
    cy.get('.coupon-input-container > :nth-child(2) > .field').type('100PERYEAR')
    cy.get('.btn-primary').click()
  }
}

export default Register
