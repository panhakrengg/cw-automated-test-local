import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsSharePost, () => {
    let copTCoPSharingNotify, quickPostTitle, shareInfo, user

    before(() => {
      homeBase.yaml.getTCoPSharingNotify((data) => {
        copTCoPSharingNotify = data
      })
      homeBase.yaml.getFromHomeAsOnlyMe((data) => {
        quickPostTitle = data.title
        shareInfo = data.share
      })
    })

    it('CoP owner shares own post from home as "Only Me" to this community then check notification - TCoP', () => {
      Story.ticket('QA-2129')

      cy.logInTestCase('Cop Owner Remove Share Post From Shared Cop')
      homeBase.login.copOwnerPhoebe(copTCoPSharingNotify.url)
      homeBase.postAction.deleteQuickPostsByContentIfExist(shareInfo.shareYourThoughts)

      cy.logInTestCase('Cop Owner Share Community From Home')
      homeBase.postAction.sharePostInHome(quickPostTitle, shareInfo, true)

      cy.logInTestCase("Verify CoP Owner Don't Receive Notification")
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)
    })
  })
})
