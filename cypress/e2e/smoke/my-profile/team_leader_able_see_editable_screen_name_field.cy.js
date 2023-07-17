import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const contactInfo = new ContactInfo()

  context(Story.profileContactInfo, () => {
    let orgAdminScreenName
    let invalidProfileStatic
    let screenNameErrorMessages

    before(() => {
      contactInfo.stub.getInvalidProfileStatic((data) => {
        invalidProfileStatic = data
      })

      contactInfo.stub.getErrorMessages((data) => {
        screenNameErrorMessages = data.screenName
      })

      contactInfo.stub.getProfileStatic((data) => {
        orgAdminScreenName = data.users.orgAdmin.contactInfo.screenName
      })
    })

    beforeEach(() => {
      contactInfo.login.toProfilePageAsTeamLeader()
    })

    it('Team Leader able to see field editable screen name and get validate', () => {
      Story.ticket('QA-818')
      contactInfo.clickEditContactInfo()
      context('Verify existing screen name', () => {
        contactInfo.inputScreenName(orgAdminScreenName)
        contactInfo.expectedShowScreenNameErrorMessage(screenNameErrorMessages.notAvailable)
      })
      context('Verify invalid symbol screen name', () => {
        contactInfo.inputScreenName(invalidProfileStatic.invalidSymbolScreenName)
        contactInfo.expectedShowScreenNameErrorMessage(screenNameErrorMessages.invalidSymbol)
      })
      context('Verify over length screen name', () => {
        contactInfo.inputScreenName(invalidProfileStatic.overLengthScreenName)
        contactInfo.expectedShowScreenNameErrorMessage(screenNameErrorMessages.overLength)
      })
    })
  })
})
