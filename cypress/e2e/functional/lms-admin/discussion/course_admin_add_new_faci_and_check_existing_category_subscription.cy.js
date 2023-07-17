import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageDiscussion from '../../../../classes/discussion/admin/ManageDiscussion'
import BaseCourseInstance from '../../../../classes/lms/admin/course-instance/base-course-instance/BaseCourseInstance'
import LmsAdminIntercept from '../../../../classes/lms/admin/interception/LmsAdminIntercept'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import EntryYamlManagement from '../../../../classes/utilities/EntryYamlManagement'
import Faker from '../../../../classes/utilities/Faker'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import ReSignInLmsAs from '../../../../classes/utilities/sign-in/ReSignInLmsAs'
import LmsUserRole from '../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  let courseId,
    instanceId,
    fullCatalogCourseInstancePeopleUrl,
    fullCatalogCourseInstanceDiscussionsUrl,
    funCategoryForNewFacilitator,
    instanceLeadFacilitator

  const faker = new Faker()
  const baseCourseInstance = new BaseCourseInstance()
  const manageDiscussion = new ManageDiscussion()

  before(() => {
    EntryYamlManagement._readData(
      'lms-admin/discussion-admin-site/course-discussion-info',
      ({ CourseData, DiscussionInfo }) => {
        const courseObj = CourseData.courseFuncDiscussion
        faker.setPathFixture(courseObj)
        courseId = faker.getUrlId()
        faker.setPathFixture(courseObj.funcInstanceDiscussion)
        instanceId = faker.getUrlId()
        baseCourseInstance.setCourseAndInstanceId(courseId, instanceId)
        fullCatalogCourseInstancePeopleUrl = baseCourseInstance.getOrgCatalogCourseInstanceUrl(
          OrgConst.FIRE_CLOUD_FULL_CATALOG_URL,
          'people'
        )
        fullCatalogCourseInstanceDiscussionsUrl = baseCourseInstance.getOrgCatalogCourseInstanceUrl(
          OrgConst.FIRE_CLOUD_FULL_CATALOG_URL,
          'discussions'
        )
        funCategoryForNewFacilitator = DiscussionInfo.categories.funCategoryForNewFaci
      }
    )

    cy.stubUser(LmsUserRole.LMS_USERS.INSTANCE_ADMIN.AU_LN_IST_LEAD_FACI_AMINA)
    cy.get('@stubUser').then((user) => {
      instanceLeadFacilitator = user
    })
  })

  context(Story.discussionAdminSite, () => {
    it('Course Admin adds new facilitator then the faci check existing categories', () => {
      Story.ticket('QA-1754')
      LmsAdminIntercept._itcGetMembers.set()
      LmsAdminIntercept._itcGetAdminMembers.set()
      new ReSignInLmsAs().couAdmin_Tressie(fullCatalogCourseInstancePeopleUrl)
      LmsAdminIntercept._itcGetMembers.wait()
      LmsAdminIntercept._itcGetAdminMembers.wait()

      cy.logInTestCase('Reset Data')
      manageDiscussion.removeFacilitator(instanceLeadFacilitator.email)

      cy.logInTestCase('Add new facilitator')
      manageDiscussion.assignFacilitator(instanceLeadFacilitator.screenName)

      cy.logInTestCase('Expect lead facilitator added')
      manageDiscussion.expectFacilitatorAddedToList(instanceLeadFacilitator.email)

      cy.logInTestCase('Expect lead facilitator is subscribed to category')
      new ReSignInLmsAs().istLeadFaci_Amina(fullCatalogCourseInstanceDiscussionsUrl)
      manageDiscussion.expectFacilitatorSubscribedToCategory(funCategoryForNewFacilitator.name)
    })
  })
})
