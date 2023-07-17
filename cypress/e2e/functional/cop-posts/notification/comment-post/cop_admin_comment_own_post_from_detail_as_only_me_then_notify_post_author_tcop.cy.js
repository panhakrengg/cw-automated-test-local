import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsCommentPost, () => {
    let cop, quickPostTitle, CommentPost, commentText

    before(() => {
      homeBase.yaml.getTCoPCommentLikeNotify((result) => {
        cop = result
      })
      homeBase.yaml.getAdminFromDetailOnlyMe((result) => {
        CommentPost = result
        commentText = CommentPost.comment.text[0]
        quickPostTitle = CommentPost.title
      })
    })

    it(`CoP Admin comment own's post from Detail visibility as "Only me" then check notify- TCoP`, () => {
      Story.ticket('QA-2132')

      cy.logInTestCase('Reset Data: Remove Existing Comment')
      homeBase.login.copAdminBettye(cop.url)
      homeBase.postAction.clickOnQuickPostToPostDetails(quickPostTitle)
      cy.wait(2000)
      homeBase.postAction.removeCommentIfExist(commentText)

      cy.logInTestCase('Cop Member Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Member Do Not Receive Web Notification')
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)
    })
  })
})
