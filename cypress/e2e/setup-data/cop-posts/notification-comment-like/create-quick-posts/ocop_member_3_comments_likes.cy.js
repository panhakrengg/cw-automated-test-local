import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupQuickPost from '../../../../../classes/cop/setup-data/SetupQuickPost'

describe(Epic.CoPPosts, () => {
  let copUrl, quickPostObj
  const setupQuickPost = new SetupQuickPost()

  before(() => {
    cy.stubCommunity('cop-posts/posting-and-sharing', 'oCoPCommentLikeNotify')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
      quickPostObj = stubCommunity.quickPosts.member3CommentsLikes
    })
  })

  context(Story.notificationsCommentPost, () => {
    it('Create quick post in oCop "Member post for 3 comments/likes"', () => {
      setupQuickPost.setQuickCoPObject(quickPostObj)

      setupQuickPost.login.toCoPHomeAsMember_Enola(copUrl)
      setupQuickPost.createQuickPost()
    })
  })
})
