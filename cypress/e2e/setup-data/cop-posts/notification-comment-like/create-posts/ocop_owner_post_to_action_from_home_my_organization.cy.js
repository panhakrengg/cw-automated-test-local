import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupPost from '../../../../../classes/cop/setup-data/SetupPost'

describe(Epic.CoPPosts, () => {
  let copUrl, postObj
  const setupPost = new SetupPost()

  before(() => {
    cy.stubCommunity('cop-posts/posting-and-sharing', 'oCoPCommentLikeNotify')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
      postObj = stubCommunity.posts.ownerActionFromHomeMyOrganization
    })
  })

  context(Story.notificationsCommentPost, () => {
    it('Create post in oCop "Owner post do action from home as My Organization"', () => {
      setupPost.login.toCreatePostAsOwner_Phoebe(copUrl)
      setupPost.createPost(postObj)
    })
  })
})
