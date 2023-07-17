import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsSharePost, () => {
    let copTCoPSharingNotify, quickPostTitle, sharePost, shareInfo, user

    before(() => {
      homeBase.yaml.getTCoPSharingNotify((data) => {
        copTCoPSharingNotify = data
      })
      homeBase.yaml.getTCoPFromHomeAsOnlyMe((data) => {
        sharePost = data
        shareInfo = sharePost.share
        quickPostTitle = sharePost.title
      })
      homeBase.yaml.getCopAdminBettye().then(($user) => {
        user = $user
      })
    })

    it('CoP admin shares post from home as "Only Me" to another community then check notification - TCoP', () => {
      Story.ticket('QA-2128')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copMember_Enola()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Cop Admin Remove Share Post From Shared Cop')
      homeBase.login.copAdminBettye(shareInfo.url)
      homeBase.postAction.deleteQuickPostsByContentIfExist(shareInfo.shareYourThoughts)

      cy.logInTestCase('Cop Admin Share Community From Post Detail')
      homeBase.postAction.visitCopHomeByUrl(copTCoPSharingNotify.url)
      homeBase.postAction.sharePostInHome(quickPostTitle, shareInfo)

      cy.logInTestCase("Verify CoP Admin Don't Receive Notification")
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)

      cy.logInTestCase('Verify CoP Member Click Notification And Redirect To Detail')
      SignInAs.copMember_Enola()
      homeBase.postAssertion.expectPostNotificationRedirectToPostDetail(sharePost)

      cy.logInTestCase('Verify CoP Member Receive Notification')
      homeBase.postAssertion.expectToReceiveSharePostNotificationAndRemove(
        user.fullName,
        copTCoPSharingNotify.name,
        quickPostTitle
      )
    })
  })
})
