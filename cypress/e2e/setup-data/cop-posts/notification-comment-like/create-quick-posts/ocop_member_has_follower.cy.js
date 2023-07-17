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
      quickPostObj = stubCommunity.quickPosts.memberPostHasFollower
    })
  })

  context(Story.notificationsCommentPost, () => {
    it('Create quick post in oCop "Member post has follower"', () => {
      setupQuickPost.setQuickCoPObject(quickPostObj)
      describe('Create quick post', () => {
        setupQuickPost.login.toCoPHomeAsMember_Murl(copUrl)
        setupQuickPost.createQuickPost()
      })
      describe('CoP Member Enola follow the post', () => {
        setupQuickPost.login.toCoPHomeAsMember_Enola(copUrl)
        setupQuickPost.followPost(quickPostObj.title)
      })
    })
  })
})
