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
  let courseId, instanceId, fullCatalogCourseInstanceUrl, funCategoryEdit, threadEditCategoryTitle

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
        funCategoryEdit = DiscussionInfo.categories.funCategoryEdit
        threadEditCategoryTitle = DiscussionInfo.threads.istFaci_Britney_ThreadEditCategory.subject
      })
  })

  context(Story.discussionAdminSite, () => {
    it('Instance Faci edit category', () => {
      Story.ticket('QA-1776')
      new SignInLmsAs().istFaci_Britney(fullCatalogCourseInstanceUrl)

      cy.logInTestCase('Reset Data')
      InterceptDiscussion.itcFindCategories.set()
      manageDiscussion.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
      InterceptDiscussion.itcFindCategories.wait()
      cy.wait(1000)
      manageDiscussion.resetCategoryInfoIfExists(
        funCategoryEdit.name.concat(' updated'),
        funCategoryEdit.name,
        funCategoryEdit.description
      )

      cy.logInTestCase('Update category')
      manageDiscussion.updateCategory(
        funCategoryEdit.name,
        funCategoryEdit.name.concat(' updated'),
        funCategoryEdit.description.concat(' updated')
      )

      cy.logInTestCase('Expect category is updated')
      manageDiscussion.expectCategoryIsUpdated(
        funCategoryEdit.name.concat(' updated'),
        funCategoryEdit.description.concat(' updated'),
        threadEditCategoryTitle
      )
    })
  })
})
