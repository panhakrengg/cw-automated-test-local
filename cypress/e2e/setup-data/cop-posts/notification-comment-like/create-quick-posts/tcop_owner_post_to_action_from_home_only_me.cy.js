import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupQuickPost from '../../../../../classes/cop/setup-data/SetupQuickPost'

describe(Epic.CoPPosts, () => {
  let copUrl, quickPostObj
  const setupQuickPost = new SetupQuickPost()

  before(() => {
    cy.stubCommunity('cop-posts/posting-and-sharing', 'tCoPCommentLikeNotify')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
      quickPostObj = stubCommunity.quickPosts.ownerActionFromHomeOnlyMe
    })
  })

  context(Story.notificationsCommentPost, () => {
    it('Create quick post in tCop "Owner post do action from home as Only Me"', () => {
      setupQuickPost.setQuickCoPObject(quickPostObj)

      setupQuickPost.login.toCoPHomeAsOwner_Phoebe(copUrl)
      setupQuickPost.createQuickPost()
    })
  })
})
