import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsCommentPost, () => {
    let cop,
      quickPostTitle,
      commentPost,
      ownerCommentText,
      adminCommentText,
      copAdminFullName,
      copOwnerFullName

    before(() => {
      homeBase.yaml.getTCoPCommentLikeNotify((result) => {
        cop = result
      })
      homeBase.yaml.getMember2CommentsLikes((result) => {
        commentPost = result
        ownerCommentText = commentPost.comment.text[0]
        adminCommentText = commentPost.comment.text[1]
        quickPostTitle = commentPost.title
      })
      homeBase.yaml.getCopAdminBettye().then(($user) => {
        copAdminFullName = $user.fullName
      })
      homeBase.yaml.getCopOwnerPhoebe().then(($user) => {
        copOwnerFullName = $user.fullName
      })
    })

    it(`2 CoP Members comment post - TCoP`, () => {
      Story.ticket('QA-1288')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copMember_Enola()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Reset Data: Cop Owner Remove Existing Comment')
      homeBase.login.copOwnerPhoebe(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, ownerCommentText)

      cy.logInTestCase('Cop Owner Add Comment')
      homeBase.postAction.addComment(ownerCommentText)
      homeBase.postAssertion.expectToSeeComment(ownerCommentText)

      cy.logInTestCase('Reset Data: Cop Admin Remove Existing Comment')
      homeBase.login.copAdminBettye(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, adminCommentText)

      cy.logInTestCase('Cop Admin Add Comment')
      homeBase.postAction.addComment(adminCommentText)
      homeBase.postAssertion.expectToSeeComment(adminCommentText)

      cy.logInTestCase('Verify Cop Member/Post Author Receive Web Notification')
      SignInAs.copMember_Enola()
      homeBase.postAssertion.verifyPostNotificationRedirectToPostDetailAndContainComments(
        commentPost,
        ownerCommentText,
        adminCommentText
      )

      cy.logInTestCase('Verify Cop Member/Post Author Receive Web Notification')
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        `${copAdminFullName} and ${copOwnerFullName}`,
        cop.name,
        quickPostTitle
      )
    })
  })
})
