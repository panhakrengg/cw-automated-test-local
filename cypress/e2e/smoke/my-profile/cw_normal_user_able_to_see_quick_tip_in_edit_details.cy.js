import Epic from '../../../classes/Epic'
import Details from '../../../classes/my-profile/Details'
import MyProfileLoginStub from '../../../classes/my-profile/stub/MyProfileLoginStub'
import MyProfileStub from '../../../classes/my-profile/stub/MyProfileStub'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const details = new Details()

  context(Story.profileContactInfo, () => {
    let quickTip

    before(() => {
      details.stub.getProfileStatic((data) => {
        quickTip = data.users.teamLeader.details.quickTip
      })
    })

    beforeEach(() => {
      details.login.toProfilePageAsInstanceMember()
    })

    it('Cw Normal User able to see a quick tip when edit detail info', () => {
      Story.ticket('QA-316')
      details.clickEditDetails()
      details.verifyQuickTip(quickTip)
    })
  })
})
