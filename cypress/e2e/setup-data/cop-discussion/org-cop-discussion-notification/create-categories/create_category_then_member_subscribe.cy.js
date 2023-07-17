import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupDiscussion from '../../../../../classes/discussion/setup-data/SetupDiscussion'

describe(Epic.CoPDiscussions, () => {
  let copUrl, categoryObj
  const setupDiscussion = new SetupDiscussion()

  before(() => {
    cy.stubDiscussionCategory('cop-discussion/cop_discussion_notification', 'memberSubscribed')
    cy.get('@stubCategory').then((stubCategory) => {
      categoryObj = stubCategory
    })
    cy.stubCommunity('cop-discussion/cop_discussion_notification', 'oCoPFuncDiscussionNotify')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
    })
  })

  context(Story.orgCoPDiscussionNotification, () => {
    it('Create category then member subscribe', () => {
      describe('Create category', () => {
        setupDiscussion.login.toCoPDiscussionAsCoPOwner_Kristy(copUrl)
        setupDiscussion.createCategoryDiscussion(categoryObj)
      })
      describe('member subscribe the category', () => {
        setupDiscussion.login.toCoPDiscussionAsCoPMember_Enola(copUrl)
        setupDiscussion.subscribeCategory(categoryObj)
      })
    })
  })
})
