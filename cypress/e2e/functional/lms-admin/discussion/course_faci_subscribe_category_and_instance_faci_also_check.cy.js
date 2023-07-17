import Discussion from '../../../../classes/constants/Discussion'
import ManageDiscussion from '../../../../classes/discussion/admin/ManageDiscussion'
import Epic from '../../../../classes/Epic'
import BaseCourseInstance from '../../../../classes/lms/admin/course-instance/base-course-instance/BaseCourseInstance'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import ReSignInLmsAs from '../../../../classes/utilities/sign-in/ReSignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseId, instanceId, fullCatalogCourseInstanceUrl, auCheckSubscriptionCategory
  const faker = new Faker()
  const baseCourseInstance = new BaseCourseInstance()
  const manageDiscussion = new ManageDiscussion()

  before(() => {
    new YamlHelper('lms-admin/discussion-admin-site/course-discussion-info')
      .read()
      .then(({ CourseData, NewCategory }) => {
        const courseObj = CourseData.courseFuncDiscussion
        faker.setPathFixture(courseObj)
        courseId = faker.getUrlId()
        faker.setPathFixture(courseObj.funcInstanceDiscussion)
        instanceId = faker.getUrlId()
        baseCourseInstance.setCourseAndInstanceId(courseId, instanceId)
        fullCatalogCourseInstanceUrl = baseCourseInstance.getOrgCatalogCourseInstanceUrl(
          OrgConst.FIRE_CLOUD_FULL_CATALOG_URL,
          'discussions'
        )
        auCheckSubscriptionCategory = NewCategory.auCheckSubscriptionCategory
      })
  })

  context(Story.discussionAdminSite, () => {
    it('Course Faci checks Subscription behavior when creating new category then Instance Faci also checks', () => {
      Story.ticket('QA-1750')

      new ReSignInLmsAs().couFaci_Joanie(fullCatalogCourseInstanceUrl)

      cy.logInTestCase('Reset Data')
      manageDiscussion.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
      manageDiscussion.removeCategoryIfExists(auCheckSubscriptionCategory.name.new)

      cy.logInTestCase('Create a new category')
      manageDiscussion.createNewCategory(
        auCheckSubscriptionCategory.name.new,
        auCheckSubscriptionCategory.description
      )

      cy.logInTestCase('Expect category is subscribed')
      manageDiscussion.expectCategoryIsSubscribed(auCheckSubscriptionCategory.name.new)

      cy.logInTestCase('Expect category is listed in my subscriptions')
      manageDiscussion.clickLeftSideBarBy(Discussion.MY_SUBSCRIPTIONS)
      manageDiscussion.expectCategoryIsInSubscribedCategories(auCheckSubscriptionCategory.name.new)

      cy.logInTestCase('Instance facilitator also subscribed to category')
      new ReSignInLmsAs().rIstFaci_Britney(fullCatalogCourseInstanceUrl)
      manageDiscussion.clickLeftSideBarBy(Discussion.MY_SUBSCRIPTIONS)
      manageDiscussion.expectCategoryIsSubscribed(auCheckSubscriptionCategory.name.new, 'a')
    })
  })
})
