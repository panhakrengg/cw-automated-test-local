import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SetupDiscussion from '../../../../classes/discussion/setup-data/SetupDiscussion'
import SetUpCourseInstance from '../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupInstance = new SetUpCourseInstance()
  const setupDiscussion = new SetupDiscussion()
  let categoryObj, threadObj

  before(() => {
    setupInstance.setCourseDiscussionAdminYaml()

    cy.stubDiscussion('lms-admin/discussion-admin-site/course-discussion-info')
    cy.get('@stubDiscussion').then((discussion) => {
      categoryObj = discussion.categories.funCategoryEdit
      threadObj = discussion.threads.istFaci_Britney_ThreadEditCategory
    })

    new SignInLmsAs().istFaci_Britney()
  })

  context(Story.discussionAdminSite, () => {
    it('Setup category on "Func Instance Discussion"', () => {
      setupInstance.setCourseBaseYaml('courseFuncDiscussion')
      setupInstance.setInstanceBaseYaml('funcInstanceDiscussion')

      setupInstance.goToDiscussions()
      setupDiscussion.createCategoryDiscussion(categoryObj)
      setupDiscussion.createThreadDiscussion(threadObj)
    })
  })
})
