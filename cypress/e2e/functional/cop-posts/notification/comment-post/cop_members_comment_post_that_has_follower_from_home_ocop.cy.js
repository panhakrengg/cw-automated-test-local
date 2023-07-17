import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsCommentPost, () => {
    let cop, quickPostTitle, commentPost, commentText, copAdminFullName

    before(() => {
      homeBase.yaml.getOCoPCommentLikeNotify((result) => {
        cop = result
      })
      homeBase.yaml.getAdminCommentOnPostHasFollower((result) => {
        commentPost = result
        commentText = commentPost.comment.text[0]
        quickPostTitle = commentPost.title
      })
      homeBase.yaml.getCopAdminBettye().then(($user) => {
        copAdminFullName = $user.fullName
      })
    })

    it(`CoP admin comment post that has follower - OCoP`, () => {
      Story.ticket('QA-2135')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copMember_Enola()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copContactManager_Murl()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Reset Data: Cop Admin Remove Existing Comment')
      homeBase.login.copAdminBettye(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, commentText)

      cy.logInTestCase('Cop Admin Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Member/Post Author Receive Web Notification')
      SignInAs.copContactManager_Murl()
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        copAdminFullName,
        cop.name,
        quickPostTitle
      )

      cy.logInTestCase('Verify Cop Member/Post Follower Receive Web Notification')
      SignInAs.copMember_Enola()
      homeBase.postAssertion.verifyPostNotificationRedirectToPostDetailAndContainComments(
        commentPost,
        commentText
      )

      cy.logInTestCase('Verify Cop Member/Post Follower Receive Web Notification')
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        copAdminFullName,
        cop.name,
        quickPostTitle
      )
    })
  })
})
