import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import AdminCourseAnnouncement from '../../../../classes/lms-admin/course-announcement/base/AdminCourseAnnouncement'
import CourseAnnouncementsYaml from '../../../../classes/lms-admin/course-announcement/base/mock/CourseAnnouncementsYaml'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const adminCourseAnnouncement = new AdminCourseAnnouncement()
  const courseAnnouncementsYaml = new CourseAnnouncementsYaml()

  context(Story.courseAnnouncementAdminSite, () => {
    let course, annment, authorName

    before(() => {
      courseAnnouncementsYaml.getCourseFuncForCreateAnnouncement((data) => {
        course = data
        annment = data.announcements.auAnnounceSpecificInstances
      })
      cy.stubUser(UserRole.LMS_USERS.CATEGORY_ADMIN.AU_LN_CTG_AD_KENTON)
      cy.get('@stubUser').then((user) => {
        authorName = user.fullName
      })
    })

    it('Category Admin create course announcement by selecting "Specific course instances"', () => {
      Story.ticket('QA-1638')
      adminCourseAnnouncement.login.toCourseAnnouncementsAsCategoryAdminKenton(course)

      cy.logInTestCase('Reset: remove announcement')
      adminCourseAnnouncement.action.deleteAllAnnouncements(annment.body)

      cy.logInTestCase('Create Course Announcement')
      adminCourseAnnouncement.action.createNewAnnouncement(annment)

      cy.logInTestCase('Announcement is created successfully')
      adminCourseAnnouncement.assertion.verifyAnnouncementCreateSuccessfully(annment)

      cy.logInTestCase('Click Cancel')
      adminCourseAnnouncement.action.clickButtonCancel()
      adminCourseAnnouncement.assertion.verifyAnnouncementRow(annment, authorName)

      cy.logInTestCase('Reset: remove announcement')
      adminCourseAnnouncement.action.deleteAllAnnouncements(annment.body)
    })
  })
})
