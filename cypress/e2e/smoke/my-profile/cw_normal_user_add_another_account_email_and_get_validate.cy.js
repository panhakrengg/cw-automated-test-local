import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const contactInfo = new ContactInfo()
  context(Story.profileContactInfo, () => {
    let invitedEmail

    before(() => {
      cy.readFile('cypress/fixtures/validation/email.yaml').then((emailString) => {
        invitedEmail = YAML.parse(emailString).Emails.invalid
      })
    })

    beforeEach(() => {
      contactInfo.login.toProfilePageAsNormalUser()
    })

    it('Cw Normal User add another account email and get validate', () => {
      Story.ticket('QA-806')
      contactInfo.clickEditContactInfo()
      contactInfo.clickAddAnotherEmail()

      context('Verify invalid message when lose focus', () => {
        contactInfo.inputContactEmail(invitedEmail)
        contactInfo.expectedShowVerificationMessage()
        cy.get('@input').blur()
        contactInfo.expectedShowIncorrectEmailMessage()
      })
      context('Verify invalid message when click verify button', () => {
        contactInfo.inputContactEmail(invitedEmail)
        contactInfo.clickVerifyEmailButton()
        contactInfo.expectedShowIncorrectEmailMessage()
      })
      context('Verify button update contact info is disabled', () => {
        // contactInfo.expectedUpdateButtonDisabled()    //Issue: known issue
      })
    })
  })
})
