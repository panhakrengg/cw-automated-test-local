import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsSharePost, () => {
    let copSharingNotify, quickPostTitle, sharePost, shareInfo, user

    before(() => {
      homeBase.yaml.getOCoPSharingNotify((data) => {
        copSharingNotify = data
      })
      homeBase.yaml.getOCoPFromDetailAsMyOrganization((data) => {
        sharePost = data
        shareInfo = sharePost.share
        quickPostTitle = sharePost.title
      })
      homeBase.yaml.getCopMemberEnola().then((data) => {
        user = data
      })
    })

    it('CoP Member shares post from detail as "My Organization" to another community then check notification - OCoP', () => {
      Story.ticket('QA-1282')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copOwner_Phoebe()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Cop Member Remove Share Post From Shared Cop')
      homeBase.login.copMemberEnola(shareInfo.url)
      homeBase.postAction.deleteQuickPostsByContentIfExist(shareInfo.shareYourThoughts)

      cy.logInTestCase('Cop Member Share Community From Post Detail')
      homeBase.postAction.visitCopHomeByUrl(copSharingNotify.url)
      homeBase.postAction.sharePostInPostDetail(quickPostTitle, shareInfo)

      cy.logInTestCase("Verify CoP Member Don't Receive Notification")
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)

      cy.logInTestCase('Verify CoP Owner Click Notification And Redirect To Detail')
      SignInAs.copOwner_Phoebe()
      homeBase.postAssertion.expectPostNotificationRedirectToPostDetail(sharePost)

      cy.logInTestCase('Verify CoP Owner Receive Notification')
      homeBase.postAssertion.expectToReceiveSharePostNotificationAndRemove(
        user.fullName,
        copSharingNotify.name,
        quickPostTitle
      )

      cy.logInTestCase("Verify CoP Admin Don't Receive Notification")
      SignInAs.copAdmin_Bettye()
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)
    })
  })
})
