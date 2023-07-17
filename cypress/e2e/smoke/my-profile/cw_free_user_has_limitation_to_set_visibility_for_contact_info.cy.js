import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const contactInfo = new ContactInfo()
  context(Story.profileVisibility, () => {
    let warningMessage
    let noteMessage

    before(() => {
      contactInfo.stub.getProfileStatic((profileStatic) => {
        warningMessage = profileStatic.contactInfo.warningMessage
        noteMessage = profileStatic.contactInfo.noteMessage
      })
    })

    beforeEach(() => {
      contactInfo.login.toProfilePageAsFreeUser()
    })
    it('Cw Free User able to see a limitation of visibility feature edit contact info', () => {
      Story.ticket('QA-737')
      contactInfo.clickEditContactInfo()
      contactInfo.checkVisibilityWarningMessage(warningMessage)
      contactInfo.checkVisibilityNoteMessage(noteMessage)
      contactInfo.verifyDisabledVisibilityForFreemiumUser()
    })
  })
})
