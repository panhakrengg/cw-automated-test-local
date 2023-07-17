import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsSharePost, () => {
    let copOCoPSharingNotify, quickPostTitle, shareInfo, user

    before(() => {
      homeBase.yaml.getOCoPSharingNotify((data) => {
        copOCoPSharingNotify = data
      })
      homeBase.yaml.getFromHomeAsOnlyMe((data) => {
        quickPostTitle = data.title
        shareInfo = data.share
      })
    })

    it('CoP owner shares own post from home as "Only Me" to this community then check notification - OCoP', () => {
      Story.ticket('QA-2123')

      cy.logInTestCase('Cop Owner Remove Share Post From Shared Cop')
      homeBase.login.copOwnerPhoebe(copOCoPSharingNotify.url)
      homeBase.postAction.deleteQuickPostsByContentIfExist(shareInfo.shareYourThoughts)

      cy.logInTestCase('Cop Owner Share Community From Home')
      homeBase.postAction.sharePostInHome(quickPostTitle, shareInfo, true)

      cy.logInTestCase("Verify CoP Owner Don't Receive Notification")
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)
    })
  })
})
