import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, { retries: 2 }, () => {
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

    it('Cw Normal User able to see a tooltip screen name change', () => {
      Story.ticket('QA-831')
      contactInfo.clickEditContactInfo()
      contactInfo.verifyScreenNameToolTip()
    })
  })
})
