import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupDiscussion from '../../../../../classes/discussion/setup-data/SetupDiscussion'

describe(Epic.CoPDiscussions, () => {
  let copUrl, threadObj
  const setupDiscussion = new SetupDiscussion()

  before(() => {
    cy.stubCommunity('cop-discussion/cop_discussion_notification', 'oCoPFuncDiscussionNotify')
    cy.stubThread('cop-discussion/cop_discussion_notification', 'voteReply')

    cy.get('@stubThread').then((stubDiscussion) => {
      threadObj = stubDiscussion
    })
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
    })
  })

  context(Story.orgCoPDiscussionNotification, () => {
    it('Create thread "Kendall - down vote reply"', () => {
      describe('admin create thread', () => {
        setupDiscussion.login.toCoPDiscussionAsCoPAdmin_Kendal(copUrl)
        setupDiscussion.createThreadDiscussion(threadObj)
      })
      describe('member reply', () => {
        setupDiscussion.login.toCoPDiscussionAsCoPMember_Enola(copUrl)
        setupDiscussion.clickThreadThenReply('byMember')
      })
    })
  })
})
