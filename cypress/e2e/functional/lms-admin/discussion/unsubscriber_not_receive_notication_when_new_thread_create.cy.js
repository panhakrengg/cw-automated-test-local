import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageDiscussion from '../../../../classes/discussion/admin/ManageDiscussion'
import Notification from '../../../../classes/discussion/base-discussion/Notification'
import BaseCourseInstance from '../../../../classes/lms/admin/course-instance/base-course-instance/BaseCourseInstance'
import WebNotification from '../../../../classes/notification/WebNotification'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import EntryYamlManagement from '../../../../classes/utilities/EntryYamlManagement'
import Faker from '../../../../classes/utilities/Faker'
import ReSignInLmsAs from '../../../../classes/utilities/sign-in/ReSignInLmsAs'
import LmsUserRole from '../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  let courseId,
    instanceId,
    courseName,
    fullCatalogCourseInstanceDiscussionsUrl,
    memberCourseDetailUrl,
    auHopeUnsubscribeCategoryNoNotification,
    funCategoryUnsubscribe,
    courseLearnerName

  const faker = new Faker()
  const baseCourseInstance = new BaseCourseInstance()
  const manageDiscussion = new ManageDiscussion()
  const notification = new Notification()
  const webNotification = new WebNotification()

  before(() => {
    EntryYamlManagement._readData(
      'lms-admin/discussion-admin-site/course-discussion-info',
      ({ DiscussionInfo, NewThreads, CourseData }) => {
        const courseObj = CourseData.courseFuncDiscussion
        faker.setPathFixture(courseObj)
        courseId = faker.getUrlId()
        courseName = courseObj.name.value
        faker.setPathFixture(courseObj.funcInstanceDiscussion)
        instanceId = faker.getUrlId()
        baseCourseInstance.setCourseAndInstanceId(courseId, instanceId)
        fullCatalogCourseInstanceDiscussionsUrl = baseCourseInstance.getOrgCatalogCourseInstanceUrl(
          OrgConst.FIRE_CLOUD_FULL_CATALOG_URL,
          'discussions'
        )
        memberCourseDetailUrl = baseCourseInstance.getMemberCourseDetailUrl('discussions')
        auHopeUnsubscribeCategoryNoNotification =
          NewThreads.auHopeUnsubscribeCategoryNoNotification.subject
        funCategoryUnsubscribe = DiscussionInfo.categories.funCategoryUnsubscribe.name
      }
    )

    cy.stubUser(LmsUserRole.LMS_USERS.LEANER.AU_LN_IST_MEM_DELPHIA)
    cy.get('@stubUser').then((user) => {
      courseLearnerName = user.fullName
    })
  })

  context(Story.discussionAdminSite, () => {
    it("Unsubscriber (previous category's owner) not receive notification when there is new thread create", () => {
      Story.ticket('QA-1766')

      cy.logInTestCase('Reset Data - Unsubscribe category if subscribed')
      new ReSignInLmsAs().rIstFaci_Britney(fullCatalogCourseInstanceDiscussionsUrl)
      manageDiscussion.unsubscribedCategoryIfSubscribed(funCategoryUnsubscribe)

      cy.logInTestCase('Reset Data - Remove thread if exists')
      new ReSignInLmsAs().istMember_Delphia(memberCourseDetailUrl)
      manageDiscussion.removeMyThreadIfExist(auHopeUnsubscribeCategoryNoNotification)

      cy.logInTestCase('Course member create new thread')
      manageDiscussion.createNewThreadUnderCategory(
        auHopeUnsubscribeCategoryNoNotification,
        funCategoryUnsubscribe,
        '_courseDetailPortlet_subject'
      )

      cy.logInTestCase('Expect facilitator not get notification')
      new ReSignInLmsAs().rIstFaci_Britney()
      webNotification.clickOnWebNotificationIcon()
      notification.verifyUserDoNotGetNewThreadWebNotification(courseLearnerName, courseName)
    })
  })
})
