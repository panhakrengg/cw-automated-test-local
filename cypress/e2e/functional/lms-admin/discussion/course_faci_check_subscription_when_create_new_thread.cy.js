import Discussion from '../../../../classes/constants/Discussion'
import ManageDiscussion from '../../../../classes/discussion/admin/ManageDiscussion'
import InterceptDiscussion from '../../../../classes/discussion/base-discussion/InterceptDiscussion'
import Epic from '../../../../classes/Epic'
import BaseCourseInstance from '../../../../classes/lms/admin/course-instance/base-course-instance/BaseCourseInstance'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import ReSignInLmsAs from '../../../../classes/utilities/sign-in/ReSignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseId, instanceId, fullCatalogCourseInstanceUrl, auAdminCheckSubscriptionThread

  const faker = new Faker()
  const baseCourseInstance = new BaseCourseInstance()
  const manageDiscussion = new ManageDiscussion()

  before(() => {
    new YamlHelper('lms-admin/discussion-admin-site/course-discussion-info')
      .read()
      .then(({ CourseData, NewThreads }) => {
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
        auAdminCheckSubscriptionThread = NewThreads.auAdminCheckSubscription.subject
      })
  })

  context(Story.discussionAdminSite, () => {
    it('Course Faci check Subscription behavior when create new thread', () => {
      Story.ticket('QA-1751')
      new ReSignInLmsAs().couFaci_Joanie(fullCatalogCourseInstanceUrl)

      cy.logInTestCase('Reset Data')
      manageDiscussion.clickLeftSideBarBy(Discussion.RECENT)
      manageDiscussion.removeThreadIfExists(auAdminCheckSubscriptionThread)

      cy.logInTestCase('Create a new thread')
      manageDiscussion.createNewThread(auAdminCheckSubscriptionThread)

      cy.logInTestCase('Expect course facilitator subscribed to thread')
      manageDiscussion.expectThreadIsSubscribed(auAdminCheckSubscriptionThread)

      cy.logInTestCase('Expect Instance facilitator not subscribed to thread')
      new ReSignInLmsAs().rIstFaci_Britney(fullCatalogCourseInstanceUrl)
      manageDiscussion.clickLeftSideBarBy(Discussion.RECENT)
      manageDiscussion.expectThreadIsNotSubscribed(auAdminCheckSubscriptionThread)
    })
  })
})
