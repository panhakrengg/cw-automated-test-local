import Notifications from '../../../../classes/account/Notifications'
import Epic from '../../../../classes/Epic'
import Learning from '../../../../classes/lms/Learning'
import LearningAdmin from '../../../../classes/lms/LearningAdmin'
import ManageCourseAnnouncements from '../../../../classes/lms/ManageCourseAnnouncements'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../classes/Story'

describe(Epic.Account, () => {
  const learning = new Learning()
  const learningAdmin = new LearningAdmin()
  const manageCourseAnnouncements = new ManageCourseAnnouncements()
  const notifications = new Notifications()

  context(Story.notificationsLearning, () => {
    let courseId
    let orgFullCatalogId
    let courseTitle
    let prefix = 'AU Announcement body'
    let announcementBody

    before(() => {
      cy.stubCourse('account', 'courseTimezone')
      cy.get('@course').then((course) => {
        courseTitle = course.title
        courseId = course.id
      })
      orgFullCatalogId = OrgConst.FULL_CATALOG_ID
      announcementBody = `${prefix} ${Date.now()}`
    })
    it('Learner get Course Announcement notification to prefer email but not web', () => {
      Story.ticket('QA-1361')

      cy.logInTestCase('Reset data')
      learningAdmin.loginAsCourseAdminInJapan()
      manageCourseAnnouncements.accessManageCourseAnnouncementBy(orgFullCatalogId, courseId)
      manageCourseAnnouncements.deleteCourseAnnouncements(prefix)

      cy.logInTestCase('Create new announcement')
      manageCourseAnnouncements.createNewAnnouncementFor(
        orgFullCatalogId,
        courseId,
        announcementBody
      )

      cy.logInTestCase('Verify email notification for create new announcement')
      manageCourseAnnouncements.verifyReceiveEmailForCreateNewAnnouncement()

      cy.logInTestCase('Verify learner not receive web notification')
      learning.loginAsCourseLearnerInJapan()
      notifications.verifyNotReceiveCreateNewAnnouncementWebNotificationBy(announcementBody)
    })
  })
})
