import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.CoPPosts, { retries: 1 }, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsCommentPost, () => {
    let cop, quickPostTitle, commentPost, commentText, commentUser

    before(() => {
      homeBase.yaml.getOCoPAcceptSharing((result) => {
        cop = result
      })
      homeBase.yaml.getOwnerCommentOnSharePostMyCommunity((result) => {
        commentPost = result
        commentText = commentPost.share.comment.text[0]
        quickPostTitle = commentPost.title
      })
      homeBase.yaml.getCopOwnerKristy().then(($user) => {
        commentUser = $user
      })
    })

    it('CoP owner comment sharing post from Home visibility as "My Community" then notify to Post Author - OCoP', () => {
      Story.ticket('QA-1285')

      cy.logInTestCase('Reset Data: Remove Existing Notification')
      SignInAs.copAdmin_Bettye()
      homeBase.webAction.clickIconThenRemoveNotification(quickPostTitle)

      cy.logInTestCase('Reset Data: Remove Existing Comment')
      homeBase.login.copOwnerKristy(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, commentText)

      cy.logInTestCase('Cop Owner Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Admin/Share Post Author Receive Web Notification')
      SignInAs.copAdmin_Bettye()
      homeBase.postAssertion.expectToReceiveCommentPostNotificationAndRemove(
        commentUser.fullName,
        cop.name,
        quickPostTitle
      )
    })
  })
})
