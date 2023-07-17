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
      contactManagerCommentText,
      copContactManagerFullName

    before(() => {
      homeBase.yaml.getOCoPCommentLikeNotify((result) => {
        cop = result
      })
      homeBase.yaml.getMember3CommentsLikes((result) => {
        commentPost = result
        ownerCommentText = commentPost.comment.text[0]
        adminCommentText = commentPost.comment.text[1]
        contactManagerCommentText = commentPost.comment.text[2]
        quickPostTitle = commentPost.title
      })
      homeBase.yaml.getCopContactManagerMurl().then(($user) => {
        copContactManagerFullName = $user.fullName
      })
    })

    it(`3 CoP Members comment post - OCoP`, () => {
      Story.ticket('QA-1289')

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

      cy.logInTestCase('Reset Data: Cop Contact Manager Remove Existing Comment')
      homeBase.login.copContactManagerMurl(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(
        quickPostTitle,
        contactManagerCommentText
      )

      cy.logInTestCase('Cop Contact Manager Add Comment')
      homeBase.postAction.addComment(contactManagerCommentText)
      homeBase.postAssertion.expectToSeeComment(contactManagerCommentText)

      cy.logInTestCase('Verify Cop Member/Post Author Receive Web Notification')
      SignInAs.copMember_Enola()
      homeBase.postAssertion.verifyPostNotificationRedirectToPostDetailAndContainComments(
        commentPost,
        ownerCommentText,
        adminCommentText,
        contactManagerCommentText
      )

      cy.logInTestCase('Verify Cop Member/Post Author Receive Web Notification')
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        `${copContactManagerFullName} and 2 others`,
        cop.name,
        quickPostTitle
      )
    })
  })
})
