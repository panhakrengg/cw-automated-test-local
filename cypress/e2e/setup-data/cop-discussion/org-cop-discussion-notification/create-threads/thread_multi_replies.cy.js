import SetupDiscussion from '../../../../../classes/discussion/setup-data/SetupDiscussion'
import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'

describe(Epic.CoPDiscussions, () => {
  let copUrl, threadObj
  const setupDiscussion = new SetupDiscussion()

  before(() => {
    cy.stubCommunity('cop-discussion/cop_discussion_notification', 'oCoPFuncDiscussionNotify')
    cy.stubThread('cop-discussion/cop_discussion_notification', 'multiReplies')

    cy.get('@stubThread').then((stubDiscussion) => {
      threadObj = stubDiscussion
    })
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
    })
  })

  context(Story.orgCoPDiscussionNotification, () => {
    it('Create thread "Kristy - thread from multi replies"', () => {
      setupDiscussion.login.toCoPDiscussionAsCoPOwner_Kristy(copUrl)
      setupDiscussion.createThreadDiscussion(threadObj)
    })
  })
})
