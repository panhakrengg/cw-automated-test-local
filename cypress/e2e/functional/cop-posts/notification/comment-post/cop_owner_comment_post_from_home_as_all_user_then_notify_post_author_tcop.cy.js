import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsCommentPost, () => {
    let cop, quickPostTitle, quickPostTruncateTitle, commentPost, commentText, user

    before(() => {
      homeBase.yaml.getTCoPCommentLikeNotify((result) => {
        cop = result
      })
      homeBase.yaml.getOwnerFromHomeAllLoggedIn((result) => {
        commentPost = result
        commentText = commentPost.comment.text[0]
        quickPostTitle = commentPost.title
        quickPostTruncateTitle = commentPost.truncateTitle
      })
      homeBase.yaml.getCopOwnerPhoebe().then(($user) => {
        user = $user
      })
    })

    it('CoP Owner comment post from Home visibility as "All Logged-in Users" then notify to Post Author - TCoP', () => {
      Story.ticket('QA-854')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copContactManager_Murl()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTruncateTitle)

      cy.logInTestCase('Reset Data: Remove Existing Comment')
      homeBase.login.copOwnerPhoebe(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, commentText)

      cy.logInTestCase('Cop Owner Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Owner Do Not Receive Web Notification')
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTruncateTitle)

      cy.logInTestCase('Verify Cop Member/Post Author Receive Web Notification')
      SignInAs.copContactManager_Murl()
      homeBase.postAssertion.verifyPostNotificationRedirectToPostDetailAndContainComments(
        commentPost,
        commentText
      )

      cy.logInTestCase('Verify Cop Member/Post Author See Post Detail And Comment')
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        user.fullName,
        cop.name,
        quickPostTruncateTitle
      )

      cy.logInTestCase('Verify Cop Admin Do Not Receive Web Notification')
      SignInAs.copAdmin_Bettye()
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTruncateTitle)
    })
  })
})
