import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsCommentPost, () => {
    let cop, quickPostTitle, commentPost, commentText, commentUser

    before(() => {
      homeBase.yaml.getTCoPCommentLikeNotify((result) => {
        cop = result
      })
      homeBase.yaml.getMemberCommentOnSharePostAllLoggedIn((result) => {
        commentPost = result
        commentText = commentPost.share.comment.text[0]
        quickPostTitle = commentPost.title
      })
      homeBase.yaml.getCopContactManagerMurl().then(($user) => {
        commentUser = $user
      })
    })

    it('CoP Member comment sharing post from Home visibility as "All Logged-in Users" then notify to Post Author - TCoP', () => {
      Story.ticket('QA-2133')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copMember_Enola()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Reset Data: Remove Existing Comment')
      homeBase.login.copContactManagerMurl(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, commentText)

      cy.logInTestCase('Cop Admin Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Owner/Original Post Author Do Not Receive Web Notification')
      SignInAs.copOwner_Phoebe()
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)

      cy.logInTestCase('Verify Cop Member/Share Post Author Receive Web Notification')
      SignInAs.copMember_Enola()
      homeBase.postAssertion.verifyPostNotificationRedirectToPostDetailAndContainComments(
        commentPost,
        commentText
      )

      cy.logInTestCase('Verify Cop Owner/Post Author See Post Detail And Comment')
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        commentUser.fullName,
        cop.name,
        quickPostTitle
      )
    })
  })
})
