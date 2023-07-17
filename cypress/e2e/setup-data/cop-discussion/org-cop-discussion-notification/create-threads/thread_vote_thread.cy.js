import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupDiscussion from '../../../../../classes/discussion/setup-data/SetupDiscussion'

describe(Epic.CoPDiscussions, () => {
  let copUrl, threadObj
  const setupDiscussion = new SetupDiscussion()

  before(() => {
    cy.stubCommunity('cop-discussion/cop_discussion_notification', 'oCoPFuncDiscussionNotify')
    cy.stubThread('cop-discussion/cop_discussion_notification', 'voteThread')

    cy.get('@stubThread').then((stubDiscussion) => {
      threadObj = stubDiscussion
    })
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
    })
  })

  context(Story.orgCoPDiscussionNotification, () => {
    it('Create thread "Enola - up vote thread"', () => {
      setupDiscussion.login.toCoPDiscussionAsCoPMember_Enola(copUrl)
      setupDiscussion.createThreadDiscussion(threadObj)
    })
  })
})
