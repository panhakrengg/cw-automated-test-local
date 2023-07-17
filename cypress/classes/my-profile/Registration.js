import InterceptReq from '../base/InterceptReq'
import Credentials from '../constants/Credentials'

class Registration {
  screenNameRandomNumber

  visitRegistrationPage() {
    this.itcFetchConfigScreenName.set()
    cy.visit('/registration')
    this.itcFetchConfigScreenName.wait()
  }
  notAvailableScreenNameErrorMessage =
    'The Screen Name you entered is not available. Please enter a different name.'
  itcFetchConfigScreenName = new InterceptReq(
    '/registration/screen_name_configuration/fetch',
    'FetchConfigScreenName'
  )
  itcCheckValidScreenName = new InterceptReq('isScreenNameValid', 'CheckValidScreenName')
  fillInFirstName(name) {
    cy.inputByPlaceholder('Enter your first name', name)
  }
  fillInLastName(name) {
    cy.inputByPlaceholder('Enter your last name', name)
  }
  fillInBirthday(date = '1998-11-11') {
    cy.inputByName('_registration_dob', date)
  }
  fillInPassword() {
    cy.inputByPlaceholder('Enter your password', Credentials.getPassword())
  }
  fillInConfirmPassword() {
    cy.inputByPlaceholder('Confirm your password', Credentials.getPassword())
  }
  checkCwRegistrationConsentForm() {
    cy.get('#_registration_crosswired-consent-form0').click()
  }
  registerButtonIsEnabled() {
    cy.get('button[type="submit"]').contains('span', 'Register').should('not.have.attr', 'disabled')
  }
  clearFirstName() {
    cy.wait(100)
    cy.get('input[placeholder="Enter your first name"]').clear()
  }
  fillInScreeName(name) {
    this.itcCheckValidScreenName.set()
    cy.inputByName('_registration_screenName', name)
    this.itcCheckValidScreenName.wait()
  }
  clearScreeName() {
    cy.get('input[name="_registration_screenName"]').clear()
  }
  verifyValidScreenName(suggestedName, randomNumber, expectedName) {
    expect(randomNumber).have.length(this.screenNameRandomNumber)
    expect(suggestedName).to.be.equal(expectedName + randomNumber)
  }
  expectedNotShowErrorMessage() {
    cy.get('input[name="_registration_screenName"] + div .required').should('not.exist')
  }
  expectedShowNotAvailableScreenName() {
    cy.get('input[name="_registration_screenName"] + div').within(() => {
      cy.contains('.required', this.notAvailableScreenNameErrorMessage).should('be.visible')
    })
  }
  getSuggestedName() {
    return new Promise((resolve, reject) => {
      cy.get('input[name="_registration_screenName"]')
        .invoke('attr', 'placeholder')
        .then(($placeholder) => {
          const suggestedName = $placeholder.replace('Example: ', '')
          const randomNumber = suggestedName.substring(
            suggestedName.length - this.screenNameRandomNumber,
            suggestedName.length
          )
          resolve({
            suggestedName: suggestedName,
            randomNumber: randomNumber,
          })
        })
    })
  }
  fillInInfoToCreateNewAccount(user) {
    this.fillInFirstName(user.givenName)
    this.fillInLastName(user.familyName)
    this.fillInScreeName(user.screenName)
    this.fillInBirthday()
    this.fillInPassword()
    this.fillInConfirmPassword()
    this.checkCwRegistrationConsentForm()
  }
  userStillInRegistrationPage() {
    cy.url().should('include', '/registration')
  }
  firstNameShowRequiredMessage() {
    cy.get('input[placeholder="Enter your first name"]')
      .parent()
      .within(($firstName) => {
        cy.wrap($firstName).should('have.class', 'has-error')
        cy.contains('div.required', 'This field is required.').should('be.visible')
      })
  }
  verifyScreenNameWithDefaultPlaceholder() {
    cy.get('input[name="_registration_screenName"]').should(
      'have.attr',
      'placeholder',
      'Enter your screen name'
    )
  }
  getValidScreenName(name) {
    cy.wait(3000)
    const minimumScreenNameLength = 6 //Value from config by super admin
    const MINIMUM_RANDOM_DIGIT_NUMBER = 4
    const extractSpecialCharactersRegex = /[^A-Za-z0-9\-\_\.]/g
    const extractedName = name.replace(extractSpecialCharactersRegex, '').substring(0, 8)
    const extractedNameLength = extractedName.length
    const requiredTotalRandomNumber = minimumScreenNameLength - extractedNameLength
    this.screenNameRandomNumber =
      requiredTotalRandomNumber <= MINIMUM_RANDOM_DIGIT_NUMBER
        ? MINIMUM_RANDOM_DIGIT_NUMBER
        : requiredTotalRandomNumber
    return extractedName.toLowerCase()
  }
  clickRegisterButton() {
    cy.get('button[type="submit"]').contains('span', 'Register').should('not.have.attr', 'disabled')
  }
  nextButtonIsEnabled() {
    cy.get('span:contains("Next")').parent().click()
  }
}

export default Registration
