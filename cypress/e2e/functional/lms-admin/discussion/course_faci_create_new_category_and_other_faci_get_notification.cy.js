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
    auFirstCategory,
    auSecondCategory,
    courseFacilitatorName

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
        auFirstCategory = NewCategory.auFirstCategory
        auSecondCategory = NewCategory.auSecondCategory
      }
    )

    new YamlHelper('users-orgmgt').read().then(({ OrgLmsUsers }) => {
      courseFacilitatorName = OrgLmsUsers.admins.courses.auLnCouFaci_Joanie.users.uat.fullNames[0]
    })
  })

  context(Story.discussionAdminSite, () => {
    it('Course Faci creates multiple new categories then other facilitators check web notification', () => {
      Story.ticket('QA-1749')
      new ReSignInLmsAs().couFaci_Joanie(fullCatalogCourseInstanceUrl)

      cy.logInTestCase('Reset Data')
      manageDiscussion.clickLeftSideBarBy(Discussion.ALL_CATEGORIES)
      manageDiscussion.removeCategoryIfExists(auFirstCategory.name.new)
      manageDiscussion.removeCategoryIfExists(auSecondCategory.name.new)

      cy.logInTestCase('Create a new first category')
      manageDiscussion.createNewCategory(auFirstCategory.name.new, auFirstCategory.description)

      cy.logInTestCase('Create a new second category')
      manageDiscussion.createNewCategory(auSecondCategory.name.new, auSecondCategory.description)

      cy.logInTestCase('Expect instance facilitator get notification')
      new ReSignInLmsAs().rIstFaci_Britney()
      webNotification.clickOnWebNotificationIcon()
      notification.verifyUserCreateNewCategoryWebNotification(
        courseFacilitatorName,
        courseName,
        auSecondCategory.name.new
      )

      cy.logInTestCase('Click on notification and verify')
      webNotification.clickOnNotificationItem()
      manageDiscussion.expectCategoryExists(auSecondCategory.name.new)

      cy.logInTestCase('Delete first notification')
      webNotification.clickOnWebNotificationIcon()
      webNotification.getNotificationBy(auSecondCategory.name.new)
      webNotification.deleteTheLastNotificationItem()
      
      cy.logInTestCase('Delete second notification')
      webNotification.getNotificationBy(auFirstCategory.name.new)
      webNotification.deleteTheLastNotificationItem()
    })
  })
})
