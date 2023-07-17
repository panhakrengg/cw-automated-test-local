import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupQuickPost from '../../../../../classes/cop/setup-data/SetupQuickPost'

describe(Epic.CoPPosts, () => {
  let copUrl, sharePostObj
  const setupQuickPost = new SetupQuickPost()

  before(() => {
    cy.stubCommunity('cop-posts/posting-and-sharing', 'tCoPCommentLikeNotify')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
      sharePostObj = stubCommunity.sharedPosts.memberShareToCurrentCommunityAllLoggedIn
    })
  })

  context(Story.notificationsCommentPost, () => {
    it('Share post in tCop "Member share post from home as All Logged-in"', () => {
      setupQuickPost.login.toCoPHomeAsMember_Enola(copUrl)
      setupQuickPost.sharePost(sharePostObj)
    })
  })
})
