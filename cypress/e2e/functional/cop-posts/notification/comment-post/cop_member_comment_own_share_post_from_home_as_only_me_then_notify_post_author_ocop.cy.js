import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsCommentPost, () => {
    let cop, quickPostTitle, commentPost, commentText, commentUser

    before(() => {
      homeBase.yaml.getOCoPAcceptSharing((result) => {
        cop = result
      })
      homeBase.yaml.getMemberCommentOnOwnSharePostOnlyMe((result) => {
        commentPost = result
        commentText = commentPost.share.comment.text[0]
        quickPostTitle = commentPost.title
      })
    })

    it(`CoP Member comment own's sharing post from Home visibility as "Only Me" then check notify - OCoP`, () => {
      Story.ticket('QA-1286')

      cy.logInTestCase('Reset Data: Remove Existing Comment')
      homeBase.login.copContactManagerMurl(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, commentText)

      cy.logInTestCase('Cop Member Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Member/Share Post Author Receive Web Notification')
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)
    })
  })
})
