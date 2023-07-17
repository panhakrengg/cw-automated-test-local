import Epic from '../../../classes/Epic'
import Registration from '../../../classes/my-profile/Registration'
import Story from '../../../classes/Story'

describe(Epic.Profile, { retries: 1 }, () => {
  const registration = new Registration()
  let screenName
  let firstName1
  let firstName2
  let firstName3
  let firstName4

  context(Story.profileContactInfo, () => {
    before(() => {
      cy.readFile('cypress/fixtures/non-cw-users.yaml').then((data) => {
        screenName = YAML.parse(data).ValidationScreenName
        firstName1 = screenName.firstName1
        firstName2 = screenName.firstName2
        firstName3 = screenName.firstName3
        firstName4 = screenName.firstName4
      })
    })

    it('Non-Cw User register a new account and fill in first name get suggest screen name', () => {
      //This will avoid uncaught exception that didn't handle correctly by our application
      Story.ticket('QA-827')
      cy.once('uncaught:exception', () => false)
      registration.visitRegistrationPage()

      context(`Input First Name "${firstName1}"`, () => {
        registration.fillInFirstName(firstName1)
        const validScreenName = registration.getValidScreenName(firstName1)
        cy.wrap(registration.getSuggestedName()).then(({ suggestedName, randomNumber }) => {
          registration.verifyValidScreenName(suggestedName, randomNumber, validScreenName)
          registration.fillInScreeName(suggestedName)
          registration.expectedNotShowErrorMessage()
        })
      })

      context(`Input Second Name "${firstName2}"`, () => {
        registration.fillInFirstName(firstName2)
        const validScreenName = registration.getValidScreenName(firstName2)
        cy.wrap(registration.getSuggestedName()).then(({ suggestedName, randomNumber }) => {
          registration.verifyValidScreenName(suggestedName, randomNumber, validScreenName)
          registration.fillInScreeName(suggestedName)
          registration.expectedNotShowErrorMessage()
        })
      })

      context(`Input Third Name "${firstName3}"`, () => {
        registration.fillInFirstName(firstName3)
        const validScreenName = registration.getValidScreenName(firstName3)
        cy.wrap(registration.getSuggestedName()).then(({ suggestedName, randomNumber }) => {
          registration.verifyValidScreenName(suggestedName, randomNumber, validScreenName)
          registration.fillInScreeName(suggestedName)
          registration.expectedNotShowErrorMessage()
        })
      })

      context('Clear First Name', () => {
        registration.clearFirstName()
        registration.clearScreeName()
        registration.firstNameShowRequiredMessage()
        registration.verifyScreenNameWithDefaultPlaceholder()
      })

      context('Input Forth Name with special character, number and valid character', () => {
        registration.fillInFirstName(firstName4)
        const validScreenName = registration.getValidScreenName(firstName4)
        cy.wrap(registration.getSuggestedName()).then(({ suggestedName, randomNumber }) => {
          registration.verifyValidScreenName(suggestedName, randomNumber, validScreenName)
          registration.fillInScreeName(suggestedName)
          registration.expectedNotShowErrorMessage()
        })
      })
    })
  })
})
