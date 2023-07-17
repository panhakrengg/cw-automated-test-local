import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsCommentPost, () => {
    let cop, quickPostTitle, commentPost, commentText, commentUserFullName

    before(() => {
      homeBase.yaml.getTCoPCommentLikeNotify((result) => {
        cop = result
      })
      homeBase.yaml.getMemberCommentOnSharePostHasFollower((result) => {
        commentPost = result
        commentText = commentPost.share.comment.text[0]
        quickPostTitle = commentPost.title
      })
      homeBase.yaml.getCopMemberEnola().then(($user) => {
        commentUserFullName = $user.fullName
      })
    })

    it(`CoP Member comment sharing post that has follower - TCoP`, () => {
      Story.ticket('QA-1287')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copAdmin_Bettye()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copContactManager_Murl()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Reset Data: Cop Member Remove Existing Comment')
      homeBase.login.copMemberEnola(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, commentText)

      cy.logInTestCase('Cop Member Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Admin/Share Post Author Receive Web Notification')
      SignInAs.copAdmin_Bettye()
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        commentUserFullName,
        cop.name,
        quickPostTitle
      )

      cy.logInTestCase('Verify Cop Member/Share Post Follower Receive Web Notification')
      SignInAs.copContactManager_Murl()
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        commentUserFullName,
        cop.name,
        quickPostTitle
      )
    })
  })
})
