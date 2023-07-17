import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsSharePost, () => {
    let copOCoPSharingNotify, quickPostTitle, shareInfo, sharePost, user

    before(() => {
      homeBase.yaml.getOCoPSharingNotify((data) => {
        copOCoPSharingNotify = data
      })
      homeBase.yaml.getOCoPFromHomeAsMyCommunity((data) => {
        sharePost = data
        shareInfo = sharePost.share
        quickPostTitle = sharePost.title
      })
      homeBase.yaml.getCopContactManagerMurl().then(($user) => {
        user = $user
      })
    })

    it('CoP contact manager shares post from home as "My Community" to another community then check notification - OCoP', () => {
      Story.ticket('QA-2122')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copMember_Enola()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Cop Contact Manager Remove Share Post From Shared Cop')
      homeBase.login.copContactManagerMurl(shareInfo.url)
      homeBase.postAction.deleteQuickPostsByContentIfExist(shareInfo.shareYourThoughts)

      cy.logInTestCase('Cop Contact Manager Share Community From Post Detail')
      homeBase.postAction.visitCopHomeByUrl(copOCoPSharingNotify.url)
      homeBase.postAction.sharePostInHome(quickPostTitle, shareInfo)

      cy.logInTestCase("Verify CoP Contact Manager Don't Receive Notification")
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)

      cy.logInTestCase('Verify CoP Member Click Notification And Redirect To Detail')
      SignInAs.copMember_Enola()
      homeBase.postAssertion.expectPostNotificationRedirectToPostDetail(sharePost)

      cy.logInTestCase('Verify CoP Member Receive Notification')
      homeBase.postAssertion.expectToReceiveSharePostNotificationAndRemove(
        user.fullName,
        copOCoPSharingNotify.name,
        quickPostTitle
      )

      cy.logInTestCase("Verify CoP Owner Don't Receive Notification")
      SignInAs.copOwner_Phoebe()
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)
    })
  })
})
