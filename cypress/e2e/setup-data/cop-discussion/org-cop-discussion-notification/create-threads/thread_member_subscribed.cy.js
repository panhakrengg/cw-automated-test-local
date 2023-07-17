import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupDiscussion from '../../../../../classes/discussion/setup-data/SetupDiscussion'

describe(Epic.CoPDiscussions, () => {
  let copUrl, threadObj
  const setupDiscussion = new SetupDiscussion()

  before(() => {
    cy.stubCommunity('cop-discussion/cop_discussion_notification', 'oCoPFuncDiscussionNotify')
    cy.stubThread('cop-discussion/cop_discussion_notification', 'memberSubscribedThread')

    cy.get('@stubThread').then((stubDiscussion) => {
      threadObj = stubDiscussion
    })
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
    })
  })

  context(Story.orgCoPDiscussionNotification, () => {
    it('Create thread "Kristy - thread is subscribed by cop member"', () => {
      describe('owner create thread', () => {
        setupDiscussion.login.toCoPDiscussionAsCoPOwner_Kristy(copUrl)
        setupDiscussion.createThreadDiscussion(threadObj)
      })
      describe('member subscribe thread', () => {
        setupDiscussion.login.toCoPDiscussionAsCoPMember_Enola(copUrl)
        setupDiscussion.subscribeThread(threadObj)
      })
    })
  })
})
