import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const contactInfo = new ContactInfo()

  context(Story.profileContactInfo, () => {
    let unitedStatePhone

    before(() => {
      contactInfo.stub.getProfileStatic((data) => {
        unitedStatePhone = data.users.teamLeader.contactInfo.phoneNumbers.personal.unitedState
      })
    })

    beforeEach(() => {
      contactInfo.login.toProfilePageAsTeamLeader()
    })

    it('Team Leader add phone number USA and get validate state code', () => {
      Story.ticket('QA-810')
      contactInfo.clickEditContactInfo()
      contactInfo.clickAddAnotherPhoneNumber()
      contactInfo.inputPhoneNumber(unitedStatePhone.label, unitedStatePhone.number)
      contactInfo.expectedUpdateButtonEnabled()
      contactInfo.inputPhoneNumber(unitedStatePhone.label, unitedStatePhone.invalidNumber)
      contactInfo.expectedShowInvalidPhoneNumberMessage()
      contactInfo.expectedUpdateButtonDisabled()
    })
  })
})
