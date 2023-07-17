import Discussion from '../../../../classes/constants/Discussion'
import ManageDiscussion from '../../../../classes/discussion/admin/ManageDiscussion'
import Notification from '../../../../classes/discussion/base-discussion/Notification'
import Epic from '../../../../classes/Epic'
import BaseCourseInstance from '../../../../classes/lms/admin/course-instance/base-course-instance/BaseCourseInstance'
import WebNotification from '../../../../classes/notification/WebNotification'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../classes/Story'
import EntryYamlManagement from '../../../../classes/utilities/EntryYamlManagement'
import Faker from '../../../../classes/utilities/Faker'
import ReSignInLmsAs from '../../../../classes/utilities/sign-in/ReSignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseId,
    courseName,
    instanceId,
    fullCatalogCourseInstanceUrl,
    auNotifyAfterNewCategoryCreate,
    instanceFacilitatorName

  const faker = new Faker()
  const baseCourseInstance = new BaseCourseInstance()
  const manageDiscussion = new ManageDiscussion()
  const webNotification = new WebNotification()
  const notification = new Notification()

  before(() => {
    EntryYamlManagement._readData(
      'lms-admin/discussion-admin-site/course-discussion-info',
      ({ CourseData, NewCategory }) => {
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
        auNotifyAfterNewCategoryCreate = NewCategory.auNotifyAfterNewCategoryCreate
      }
    )

    new YamlHelper('users-orgmgt').read().then(({ OrgLmsUsers }) => {
      instanceFacilitatorName =
        OrgLmsUsers.admins.instances.auLnIstFaci_Britney.users.uat.fullNames[0]
    })
  })

  context(Story.discussionAdminSite, () => {
    it('Instance Faci creates 1 new category then other facilitators & learner check web notification', () => {
      Story.ticket('QA-1748')
      new ReSignInLmsAs().rIstFaci_Britney(fullCatalogCourseInstanceUrl)

      cy.logInTestCase('Reset Data')
      manageDiscussion.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
      manageDiscussion.removeCategoryIfExists(auNotifyAfterNewCategoryCreate.name.new)

      cy.logInTestCase('Create a new category')
      manageDiscussion.createNewCategory(
        auNotifyAfterNewCategoryCreate.name.new,
        auNotifyAfterNewCategoryCreate.description
      )

      cy.logInTestCase('Expect course facilitator get notification')
      new ReSignInLmsAs().couFaci_Joanie()
      webNotification.clickOnWebNotificationIcon()
      notification.verifyUserCreateNewCategoryWebNotification(
        instanceFacilitatorName,
        courseName,
        auNotifyAfterNewCategoryCreate.name.new
      )

      cy.logInTestCase('Click on notification and verify')
      webNotification.clickOnNotificationItem()
      manageDiscussion.expectCategoryExists(auNotifyAfterNewCategoryCreate.name.new)

      cy.logInTestCase('Expect course learner not get notification')
      new ReSignInLmsAs().istMember_Delphia()
      webNotification.clickOnWebNotificationIcon()
      webNotification.notReceiveNotification(auNotifyAfterNewCategoryCreate.name.new)
    })
  })
})
