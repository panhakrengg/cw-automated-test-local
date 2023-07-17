import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SetupDiscussion from '../../../../classes/discussion/setup-data/SetupDiscussion'
import SetUpCourseInstance from '../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupInstance = new SetUpCourseInstance()
  const setupDiscussion = new SetupDiscussion()
  let categoryObj

  before(() => {
    setupInstance.setCourseDiscussionAdminYaml()

    cy.stubDiscussionCategory(
      'lms-admin/discussion-admin-site/course-discussion-info',
      'funCategoryUnsubscribe'
    )
    cy.get('@stubCategory').then((category) => {
      categoryObj = category
    })

    new SignInLmsAs().istFaci_Britney()
  })

  context(Story.discussionAdminSite, () => {
    it('Setup unsubscribe category on "Func Instance Discussion"', () => {
      setupInstance.setCourseBaseYaml('courseFuncDiscussion')
      setupInstance.setInstanceBaseYaml('funcInstanceDiscussion')

      setupInstance.goToDiscussions()
      setupDiscussion.createCategoryDiscussion(categoryObj)
      setupDiscussion.unsubscribeCategory(categoryObj)
    })
  })
})
