import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupPost from '../../../../../classes/cop/setup-data/SetupPost'

describe(Epic.CoPPosts, () => {
  let copUrl, postObj
  const setupPost = new SetupPost()

  before(() => {
    cy.stubCommunity('cop-posts/posting-and-sharing', 'oCoPSharingNotify')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
      postObj = stubCommunity.posts.ownerSharingFromDetail
    })
  })

  context(Story.notificationsSharePost, () => {
    it('Create post in oCop "Owner post for sharing from detail"', () => {
      setupPost.login.toCreatePostAsOwner_Phoebe(copUrl)
      setupPost.createPost(postObj)
    })
  })
})
