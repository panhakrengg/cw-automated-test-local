import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsSharePost, () => {
    let copTCoPSharingNotify, quickPostTitle, shareInfo, user

    before(() => {
      homeBase.yaml.getTCoPSharingNotify((data) => {
        copTCoPSharingNotify = data
      })
      homeBase.yaml.getTCoPFromDetailAsMyCommunity((data) => {
        quickPostTitle = data.title
        shareInfo = data.share
      })
      homeBase.yaml.getCopContactManagerMurl().then(($user) => {
        user = $user
      })
    })

    it('CoP contact manager shares post from detail as "My Community" to this community then check notification - TCoP', () => {
      Story.ticket('QA-2130')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copOwner_Phoebe()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Cop Contact Manager Remove Share Post From Shared Cop')
      homeBase.login.copContactManagerMurl(copTCoPSharingNotify.url)
      homeBase.postAction.deleteQuickPostsByContentIfExist(shareInfo.shareYourThoughts)

      cy.logInTestCase('Cop Contact Manager Share Community From Detail')
      homeBase.postAction.sharePostInPostDetail(quickPostTitle, shareInfo, true)

      cy.logInTestCase("Verify CoP Contact Manager Don't Receive Notification")
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)

      cy.logInTestCase('Verify CoP Owner as Post Author Receive Notification')
      SignInAs.copOwner_Phoebe()
      homeBase.postAssertion.expectToReceiveSharePostNotificationAndRemove(
        user.fullName,
        copTCoPSharingNotify.name,
        quickPostTitle
      )
    })
  })
})
