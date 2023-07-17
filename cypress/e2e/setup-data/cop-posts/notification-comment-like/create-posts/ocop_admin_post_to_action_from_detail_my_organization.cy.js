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
      postObj = stubCommunity.posts.adminActionFromDetailMyOrganization
    })
  })

  context(Story.notificationsCommentPost, () => {
    it('Create post in oCop "Admin post do action from detail as My Organization"', () => {
      setupPost.login.toCreatePostAsAdmin_Bettye(copUrl)
      setupPost.createPost(postObj)
    })
  })
})
