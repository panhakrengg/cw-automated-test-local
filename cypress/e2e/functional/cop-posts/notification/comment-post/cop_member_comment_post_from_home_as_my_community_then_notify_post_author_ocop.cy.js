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
      homeBase.yaml.getMemberFromHomeMyCommunity((result) => {
        commentPost = result
        commentText = commentPost.comment.text[0]
        quickPostTitle = commentPost.title
      })
      homeBase.yaml.getCopMemberEnola().then(($user) => {
        user = $user
      })
    })

    it('CoP Member comment post from Home visibility as "Community" then notify to Post Author - OCoP', () => {
      Story.ticket('QA-1283')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copAdmin_Bettye()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Reset Data: Remove Existing Comment')
      homeBase.login.copMemberEnola(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, commentText)

      cy.logInTestCase('Cop Member Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Admin/Post Author Receive Web Notification')
      SignInAs.copAdmin_Bettye()
      homeBase.postAssertion.verifyPostNotificationRedirectToPostDetailAndContainComments(
        commentPost,
        commentText
      )

      cy.logInTestCase('Verify Cop Admin/Post Author See Post Detail And Comment')
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        user.fullName,
        cop.name,
        quickPostTitle
      )
    })
  })
})
