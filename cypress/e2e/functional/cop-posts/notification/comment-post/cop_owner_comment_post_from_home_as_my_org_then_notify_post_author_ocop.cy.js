import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsCommentPost, () => {
    let cop, quickPostTitle, commentPost, commentText, user

    before(() => {
      homeBase.yaml.getOCoPCommentLikeNotify((result) => {
        cop = result
      })
      homeBase.yaml.getAdminFromHomeMyOrganization((result) => {
        commentPost = result
        commentText = commentPost.comment.text[0]
        quickPostTitle = commentPost.title
      })
      homeBase.yaml.getCopAdminBettye().then(($user) => {
        user = $user
      })
    })

    it('CoP Admin comment post from Home visibility as "My Organization" then notify to Post Author - OCoP', () => {
      Story.ticket('QA-1162')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copOwner_Phoebe()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Reset Data: Remove Existing Comment')
      homeBase.login.copAdminBettye(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, commentText)

      cy.logInTestCase('Cop Admin Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Admin Do Not Receive Web Notification')
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)

      cy.logInTestCase('Verify Cop Owner/Post Author Receive Web Notification')
      SignInAs.copOwner_Phoebe()
      homeBase.postAssertion.verifyPostNotificationRedirectToPostDetailAndContainComments(
        commentPost,
        commentText
      )

      cy.logInTestCase('Verify Cop Owner/Post Author See Post Detail And Comment')
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        user.fullName,
        cop.name,
        quickPostTitle
      )
    })
  })
})
