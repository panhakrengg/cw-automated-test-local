import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupQuickPost from '../../../../../classes/cop/setup-data/SetupQuickPost'

describe(Epic.CoPPosts, () => {
  let copUrl, quickPostObj
  const setupQuickPost = new SetupQuickPost()

  before(() => {
    cy.stubCommunity('cop-posts/posting-and-sharing', 'oCoPSharingNotify')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
      quickPostObj = stubCommunity.quickPosts.memberSharingFromHomeAsOnlyMe
    })
  })

  context(Story.notificationsSharePost, () => {
    it('Create post in oCop "Member quick post for sharing from home as Only Me"', () => {
      setupQuickPost.setQuickCoPObject(quickPostObj)

      setupQuickPost.login.toCoPHomeAsMember_Enola(copUrl)
      setupQuickPost.createQuickPost()
    })
  })
})
