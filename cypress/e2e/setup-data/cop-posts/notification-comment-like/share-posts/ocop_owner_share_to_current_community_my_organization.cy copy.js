import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupQuickPost from '../../../../../classes/cop/setup-data/SetupQuickPost'

describe(Epic.CoPPosts, () => {
  let copUrl, sharePostObj
  const setupQuickPost = new SetupQuickPost()

  before(() => {
    cy.stubCommunity('cop-posts/posting-and-sharing', 'oCoPCommentLikeNotify')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
      sharePostObj = stubCommunity.sharedPosts.ownerShareToCurrentCommunityMyOrganization
    })
  })

  context(Story.notificationsCommentPost, () => {
    it('Share post in oCop "Owner share post from home as My Organization"', () => {
      setupQuickPost.login.toCoPHomeAsOwner_Phoebe(copUrl)
      setupQuickPost.sharePost(sharePostObj)
    })
  })
})
