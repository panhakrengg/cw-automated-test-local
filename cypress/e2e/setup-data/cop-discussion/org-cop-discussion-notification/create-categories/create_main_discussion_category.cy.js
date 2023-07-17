import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupDiscussion from '../../../../../classes/discussion/setup-data/SetupDiscussion'

describe(Epic.CoPDiscussions, () => {
  let copUrl, categoryObj
  const setupDiscussion = new SetupDiscussion()

  before(() => {
    cy.stubCommunity('cop-discussion/cop_discussion_notification', 'oCoPFuncDiscussionNotify')
    cy.stubDiscussionCategory(
      'cop-discussion/cop_discussion_notification',
      'mainDiscussionCategory'
    )

    cy.get('@stubCategory').then((stubCategory) => {
      categoryObj = stubCategory
    })
    cy.get('@stubCommunity').then((stubCommunity) => {
      copUrl = stubCommunity.url
    })
  })

  context(Story.orgCoPDiscussionNotification, () => {
    it('Create category "Main Discussion Category"', () => {
      setupDiscussion.login.toCoPDiscussionAsCoPOwner_Kristy(copUrl)
      setupDiscussion.createCategoryDiscussion(categoryObj)
    })
  })
})
