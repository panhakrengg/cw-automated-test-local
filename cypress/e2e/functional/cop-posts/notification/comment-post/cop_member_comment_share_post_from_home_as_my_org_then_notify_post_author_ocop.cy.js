import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsCommentPost, () => {
    let cop, quickPostTitle, commentPost, commentText, copMemberFullName

    before(() => {
      homeBase.yaml.getOCoPCommentLikeNotify((result) => {
        cop = result
      })
      homeBase.yaml.getMemberCommentOnSharePostMyOrganization((result) => {
        commentPost = result
        commentText = commentPost.share.comment.text[0]
        quickPostTitle = commentPost.title
      })
      homeBase.yaml.getCopMemberEnola().then(($user) => {
        copMemberFullName = $user.fullName
      })
    })

    it(`CoP Member comment sharing post from Home visibility as "My Organization" then notify to Post Author - OCoP`, () => {
      Story.ticket('QA-2134')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copOwner_Phoebe()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Reset Data: Cop Member Remove Existing Comment')
      homeBase.login.copMemberEnola(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, commentText)

      cy.logInTestCase('Cop Member Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Owner/Share Post Author Receive Web Notification')
      SignInAs.copOwner_Phoebe()
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        copMemberFullName,
        cop.name,
        quickPostTitle
      )
    })
  })
})
