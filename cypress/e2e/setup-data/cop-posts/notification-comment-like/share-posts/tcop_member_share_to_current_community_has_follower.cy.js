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
      sharePostObj = stubCommunity.sharedPosts.adminShareToCurrentCommunityHasFollower
    })
  })

  context(Story.notificationsCommentPost, () => {
    it('Share post in tCop "Admin share post from home has follower"', () => {
      describe('Share post', () => {
        setupQuickPost.login.toCoPHomeAsAdmin_Bettye(copUrl)
        setupQuickPost.sharePost(sharePostObj)
      })

      describe('CoP Member Murl follow the share post', () => {
        setupQuickPost.login.toCoPHomeAsMember_Murl(copUrl)
        setupQuickPost.followPost(sharePostObj.share.shareYourThoughts)
      })
    })
  })
})
