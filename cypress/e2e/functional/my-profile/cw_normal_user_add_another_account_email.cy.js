import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, { retries: 2 }, () => {
  const contactInfo = new ContactInfo()
  const profileInfo = new ProfileInfo()

  context(Story.profileContactInfo, () => {
    let email

    before(() => {
      cy.readFile('cypress/fixtures/emails.yaml').then((emailString) => {
        email = YAML.parse(emailString).Emails.test.email
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsNormalUser()
    })

    it('Cw Normal User add another account email', () => {
      Story.ticket('QA-111')
      contactInfo.clickEditContactInfo()

      context('Prepare data', () => {
        cy.logInTestCase('Prepare data')
        contactInfo.removeAllVerifiedContactEmail()
        contactInfo.removeAllUnverifiedEmail(email)
        contactInfo.clickUpdateContactInfoIfEnable()
        cy.waitUntilToastDisappear()
      })

      context('Add new contact email', () => {
        cy.logInTestCase('Add new contact email')
        contactInfo.clickAddAnotherEmail()
        contactInfo.inputContactEmail(email)
        contactInfo.clickVerifyEmailButton()
        contactInfo.expectedShowSuccessSendVerificationEmailToast()
        contactInfo.expectedShowUnverifiedEmail(email)
        contactInfo.clickUpdateContactInfoButton()
        contactInfo.expectedUpdateButtonDisabled()
        contactInfo.expectedShowSuccessUpdateToast()
      })
      context('Verify verification email', () => {
        cy.logInTestCase('Verify verification email')
        contactInfo.verifyVerificationEmailTemplate(email)
        contactInfo.clickConfirmInVerificationEmail()
        profileInfo.checkEmailUnderContactInfoInMyProfile(email)
        contactInfo.clickEditContactInfo()
        contactInfo.expectedShowVerifiedEmail(email)
      })
      context('Reset data', () => {
        cy.logInTestCase('Reset data')
        contactInfo.removeVerifiedContactEmail()
        contactInfo.clickUpdateContactInfoButton()
        contactInfo.expectedUpdateButtonDisabled()
        contactInfo.expectedShowSuccessUpdateToast()
      })
    })
  })
})
