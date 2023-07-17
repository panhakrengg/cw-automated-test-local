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
      homeBase.yaml.getMemberFromDetailAllLogin((result) => {
        commentPost = result
        commentText = commentPost.comment.text[0]
        quickPostTitle = commentPost.title
        quickPostTruncateTitle = commentPost.truncateTitle
      })
      homeBase.yaml.getCopMemberEnola().then(($user) => {
        user = $user
      })
    })

    it(`CoP Member comment post from Detail visibility as "All Logged-in Users" then notify to Post Author - TCoP`, () => {
      Story.ticket('QA-1165')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copOwner_Phoebe()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTruncateTitle)

      cy.logInTestCase('Reset Data: Remove Existing Comment')
      homeBase.login.copMemberEnola(cop.url)
      homeBase.postAction.clickOnQuickPostToPostDetails(quickPostTitle)
      cy.wait(2000)
      homeBase.postAction.removeCommentIfExist(commentText)

      cy.logInTestCase('Cop Member Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Member Do Not Receive Web Notification')
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTruncateTitle)

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
        quickPostTruncateTitle
      )

      cy.logInTestCase('Verify Cop Admin Receive Web Notification')
      SignInAs.copAdmin_Bettye()
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTruncateTitle)
    })
  })
})
