import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import HomeBase from '../../../../../classes/cop/home/base/HomeBase'

describe(Epic.CoPPosts, () => {
  const homeBase = new HomeBase()

  context(Story.notificationsCommentPost, () => {
    let cop, quickPostTitle, commentPost, commentText

    before(() => {
      homeBase.yaml.getTCoPCommentLikeNotify((result) => {
        cop = result
      })
      homeBase.yaml.getOwnerFromHomeOnlyMe((result) => {
        commentPost = result
        commentText = commentPost.comment.text[0]
        quickPostTitle = commentPost.title
      })
    })

    it(`CoP Owner comment own's post from Home visibility as "Only me" then check notify - TCoP`, () => {
      Story.ticket('QA-1284')

      cy.logInTestCase('Reset Data: Remove Existing Comment')
      homeBase.login.copOwnerPhoebe(cop.url)
      homeBase.postAction.removeCommentFromPostIfExistInHome(quickPostTitle, commentText)

      cy.logInTestCase('Cop Owner Add Comment')
      homeBase.postAction.addComment(commentText)
      homeBase.postAssertion.expectToSeeComment(commentText)

      cy.logInTestCase('Verify Cop Owner/Post Author Do Not Receive Web Notification')
      homeBase.postAssertion.expectNotToReceiveNotification(quickPostTitle)
    })
  })
})
