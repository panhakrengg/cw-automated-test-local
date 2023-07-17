import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsSharePost, () => {
    let copTCoPSharingNotify, quickPostTitle, sharePost, shareInfo, user

    before(() => {
      homeBase.yaml.getTCoPSharingNotify((data) => {
        copTCoPSharingNotify = data
      })
      homeBase.yaml.getTCoPFromHomeAsMyCommunity((data) => {
        sharePost = data
        shareInfo = sharePost.share
        quickPostTitle = sharePost.title
      })
      homeBase.yaml.getCopContactManagerMurl().then(($user) => {
        user = $user
      })
    })

    it('CoP contact manager shares post from home as "My Community" to another community then check notification - TCoP', () => {
      Story.ticket('QA-2127')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copMember_Enola()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Cop Contact Manager Remove Share Post From Shared Cop')
      homeBase.login.copContactManagerMurl(shareInfo.url)
      homeBase.postAction.deleteQuickPostsByContentIfExist(shareInfo.shareYourThoughts)

      cy.logInTestCase('Cop Contact Manager Share Community From Post Detail')
      homeBase.postAction.visitCopHomeByUrl(copTCoPSharingNotify.url)
      homeBase.postAction.sharePostInHome(quickPostTitle, shareInfo)

      cy.logInTestCase("Verify Cop Contact Manager Don't Receive Notification")
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

      cy.logInTestCase("Verify CoP Owner Don't Receive Notification")
      SignInAs.copOwner_Phoebe()
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)
    })
  })
})
