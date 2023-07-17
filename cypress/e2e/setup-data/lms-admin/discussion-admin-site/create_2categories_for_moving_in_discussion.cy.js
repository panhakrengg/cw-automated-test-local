import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SetupDiscussion from '../../../../classes/discussion/setup-data/SetupDiscussion'
import SetUpCourseInstance from '../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupInstance = new SetUpCourseInstance()
  const setupDiscussion = new SetupDiscussion()
  const discussionYamlPart = 'lms-admin/discussion-admin-site/course-discussion-info'
  let parentCategory, funCategoryMoveParent

  before(() => {
    setupInstance.setCourseDiscussionAdminYaml()

    cy.stubAllDiscussionCategories(discussionYamlPart)
    cy.get('@stubAllCategories').then((allCategories) => {
      parentCategory = allCategories.parentCategory
      funCategoryMoveParent = allCategories.funCategoryMoveParent
    })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.discussionAdminSite, () => {
    it('Setup unsubscribe category on "Func Instance Discussion"', () => {
      setupInstance.setCourseBaseYaml('courseFuncDiscussion')
      setupInstance.setInstanceBaseYaml('funcInstanceDiscussion')

      cy.logInTestCase('Parent category')
      setupInstance.goToDiscussions()
      setupDiscussion.createCategoryDiscussion(parentCategory)

      cy.logInTestCase('Fun category for moving to None category')
      setupDiscussion.createAnotherCategoryDiscussion(funCategoryMoveParent)
    })
  })
})
