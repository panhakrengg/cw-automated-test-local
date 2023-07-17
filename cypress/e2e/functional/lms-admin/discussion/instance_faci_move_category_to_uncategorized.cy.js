import Discussion from '../../../../classes/constants/Discussion'
import ManageDiscussion from '../../../../classes/discussion/admin/ManageDiscussion'
import InterceptDiscussion from '../../../../classes/discussion/base-discussion/InterceptDiscussion'
import Epic from '../../../../classes/Epic'
import BaseCourseInstance from '../../../../classes/lms/admin/course-instance/base-course-instance/BaseCourseInstance'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseId, instanceId, fullCatalogCourseInstanceUrl, funCategoryMoveParent, parentCategory

  const faker = new Faker()
  const baseCourseInstance = new BaseCourseInstance()
  const manageDiscussion = new ManageDiscussion()

  before(() => {
    new YamlHelper('lms-admin/discussion-admin-site/course-discussion-info')
      .read()
      .then(({ CourseData, DiscussionInfo }) => {
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
        funCategoryMoveParent = DiscussionInfo.categories.funCategoryMoveParent
        parentCategory = DiscussionInfo.categories.parentCategory
      })
  })

  context(Story.discussionAdminSite, () => {
    it('Instance Faci move category to uncategorized', () => {
      Story.ticket('QA-1775')
      new SignInLmsAs().istFaci_Britney(fullCatalogCourseInstanceUrl)

      cy.logInTestCase('Reset Data')
      InterceptDiscussion.itcFindCategories.set()
      manageDiscussion.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
      InterceptDiscussion.itcFindCategories.wait()
      cy.wait(1000)
      manageDiscussion.resetCategoryToParentIfNotExist(
        parentCategory.name,
        funCategoryMoveParent.name
      )

      cy.logInTestCase('Move category to None category')
      manageDiscussion.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
      manageDiscussion.moveCategory(
        parentCategory.name,
        funCategoryMoveParent.name,
        Discussion.NONE
      )
      cy.logInTestCase('expect note to find category in parent category')
      manageDiscussion.expectNotToFindCategoryInParentCategory(funCategoryMoveParent.name)

      cy.logInTestCase('expect to find category in all category list')
      manageDiscussion.clickLeftSideBarBy(Discussion.MY_SUBSCRIPTIONS)
      cy.wait(1000)
      InterceptDiscussion.itcFindCategories.set()
      manageDiscussion.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
      InterceptDiscussion.itcFindCategories.wait()
      cy.wait(1000)
      manageDiscussion.expectCategoryToFindInAllCategoryList(funCategoryMoveParent.name)
    })
  })
})
