import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupPost from '../../../../../classes/cop/setup-data/SetupPost'

describe(Epic.CoPPosts, () => {
  let copUrl, postObj
  const setupPost = new SetupPost()

  before(() => {
    cy.stubCommunity('cop-posts/posting-and-sharing', 'tCoPCommentLikeNotify')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
      postObj = stubCommunity.posts.ownerActionFromDetailAllLoggedIn
    })
  })

  context(Story.notificationsCommentPost, () => {
    it('Create post in tCop "Admin post do action from detail as My Organization"', () => {
      setupPost.login.toCreatePostAsOwner_Phoebe(copUrl)
      setupPost.createPost(postObj)
    })
  })
})
