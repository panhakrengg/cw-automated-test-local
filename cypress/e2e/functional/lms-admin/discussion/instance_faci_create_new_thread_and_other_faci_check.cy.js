import Discussion from '../../../../classes/constants/Discussion'
import ManageDiscussion from '../../../../classes/discussion/admin/ManageDiscussion'
import Notification from '../../../../classes/discussion/base-discussion/Notification'
import Epic from '../../../../classes/Epic'
import BaseCourseInstance from '../../../../classes/lms/admin/course-instance/base-course-instance/BaseCourseInstance'
import WebNotification from '../../../../classes/notification/WebNotification'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import ReSignInLmsAs from '../../../../classes/utilities/sign-in/ReSignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseId,
    courseName,
    instanceId,
    fullCatalogCourseInstanceUrl,
    auAdminNotifyAfterNewThreadCreate,
    instanceFacilitatorName

  const faker = new Faker()
  const baseCourseInstance = new BaseCourseInstance()
  const manageDiscussion = new ManageDiscussion()
  const webNotification = new WebNotification()
  const notification = new Notification()

  before(() => {
    new YamlHelper('lms-admin/discussion-admin-site/course-discussion-info')
      .read()
      .then(({ CourseData, NewThreads }) => {
        const courseObj = CourseData.courseFuncDiscussion
        faker.setPathFixture(courseObj)
        courseId = faker.getUrlId()
        courseName = courseObj.name.value
        faker.setPathFixture(courseObj.funcInstanceDiscussion)
        instanceId = faker.getUrlId()
        baseCourseInstance.setCourseAndInstanceId(courseId, instanceId)
        fullCatalogCourseInstanceUrl = baseCourseInstance.getOrgCatalogCourseInstanceUrl(
          OrgConst.FIRE_CLOUD_FULL_CATALOG_URL,
          'discussions'
        )
        auAdminNotifyAfterNewThreadCreate = NewThreads.auAdminNotifyAfterNewThreadCreate.subject
      })
    new YamlHelper('users-orgmgt').read().then(({ OrgLmsUsers }) => {
      instanceFacilitatorName =
        OrgLmsUsers.admins.instances.auLnIstFaci_Britney.users.uat.fullNames[0]
    })
  })

  context(Story.discussionAdminSite, () => {
    it('Instance Faci creates new thread then other facilitators & learner check web notification', () => {
      Story.ticket('QA-1756')
      new ReSignInLmsAs().istFaci_Britney(fullCatalogCourseInstanceUrl)

      cy.logInTestCase('Reset Data')
      manageDiscussion.clickLeftSideBarBy(Discussion.RECENT)
      manageDiscussion.removeThreadIfExists(auAdminNotifyAfterNewThreadCreate)

      cy.logInTestCase('Create a new thread')
      manageDiscussion.createNewThread(auAdminNotifyAfterNewThreadCreate)

      cy.logInTestCase('Expect course facilitator get notification')
      new ReSignInLmsAs().couFaci_Joanie()
      webNotification.clickOnWebNotificationIcon()
      notification.verifyUserCreateNewThreadWebNotification(
        instanceFacilitatorName,
        courseName,
        auAdminNotifyAfterNewThreadCreate
      )

      cy.logInTestCase('Expect course learner not get notification')
      new ReSignInLmsAs().istMember_Delphia()
      webNotification.clickOnWebNotificationIcon()
      webNotification.notReceiveNotification(auAdminNotifyAfterNewThreadCreate)
    })
  })
})
