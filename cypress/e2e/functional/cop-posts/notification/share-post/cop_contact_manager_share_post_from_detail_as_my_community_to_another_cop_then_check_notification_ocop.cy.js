import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsSharePost, () => {
    let copOCoPSharingNotify, quickPostTitle, shareInfo, user

    before(() => {
      homeBase.yaml.getOCoPSharingNotify((data) => {
        copOCoPSharingNotify = data
      })
      homeBase.yaml.getOCoPFromDetailAsMyCommunity((data) => {
        quickPostTitle = data.title
        shareInfo = data.share
      })
      cy.stubUser(UserRole.CoPAdministrationUser.CONTACT_MANAGER_MURL).then(($user) => {
        user = $user
      })
    })

    it('CoP contact manager shares post from detail as "My Community" to this community then check notification - OCoP', () => {
      Story.ticket('QA-2125')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copOwner_Phoebe()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Cop Contact Manager Remove Share Post From Shared Cop')
      homeBase.login.copContactManagerMurl(copOCoPSharingNotify.url)
      homeBase.postAction.deleteQuickPostsByContentIfExist(shareInfo.shareYourThoughts)

      cy.logInTestCase('Cop Contact Manager Share Community From Detail')
      homeBase.postAction.sharePostInPostDetail(quickPostTitle, shareInfo, true)

      cy.logInTestCase("Verify CoP Contact Manager Don't Receive Notification")
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)

      cy.logInTestCase('Verify CoP Owner as Post Author Receive Notification')
      SignInAs.copOwner_Phoebe()
      homeBase.postAssertion.expectToReceiveSharePostNotificationAndRemove(
        user.fullName,
        copOCoPSharingNotify.name,
        quickPostTitle
      )
    })
  })
})
