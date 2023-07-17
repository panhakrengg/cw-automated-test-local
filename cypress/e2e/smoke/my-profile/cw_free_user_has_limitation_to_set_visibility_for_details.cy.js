import Epic from '../../../classes/Epic'
import Details from '../../../classes/my-profile/Details'
import MyProfileLoginStub from '../../../classes/my-profile/stub/MyProfileLoginStub'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const details = new Details()
  context(Story.profileVisibility, () => {
    let warningMessage
    let noteMessage

    before(() => {
      details.stub.getProfileStatic((profileStatic) => {
        warningMessage = profileStatic.Details.warningMessage
        noteMessage = profileStatic.Details.noteMessage
      })
    })

    it('Cw Free User able to see a limitation of visibility feature on details', () => {
      Story.ticket('738')
      details.login.toProfilePageAsFreeUser()
      details.clickEditDetails()
      details.checkVisibilityWarningMessage(warningMessage)
      details.checkVisibilityNoteMessage(noteMessage)
      details.verifyDetailsFreemiumVisibility()
    })
  })
})
