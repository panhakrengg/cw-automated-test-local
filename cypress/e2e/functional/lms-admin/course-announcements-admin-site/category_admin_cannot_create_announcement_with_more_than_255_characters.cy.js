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
        annment = data.announcements.auAnnouncementMoreThan255
      })
      cy.stubUser(UserRole.LMS_USERS.CATEGORY_ADMIN.AU_LN_CTG_AD_KENTON)
      cy.get('@stubUser').then((user) => {
        authorName = user.fullName
      })
    })

    it('Category Admin cannot create announcement with more than 255 characters', () => {
      Story.ticket('QA-2064')
      adminCourseAnnouncement.login.toCourseAnnouncementsAsCategoryAdminKenton(course)

      cy.logInTestCase('Reset: remove announcement')
      adminCourseAnnouncement.action.deleteAllAnnouncements(annment.body)

      cy.logInTestCase('Create Course Announcement')
      adminCourseAnnouncement.action.createNewAnnouncement(annment)

      cy.logInTestCase('Announcement is created successfully')
      adminCourseAnnouncement.assertion.verifyAnnouncementCannotCreateMoreThen255(annment)

      cy.logInTestCase('Click Cancel')
      adminCourseAnnouncement.action.clickButtonCancel()
      adminCourseAnnouncement.assertion.verifyAnnouncementRow(annment, authorName)

      cy.logInTestCase('Reset: remove announcement')
      adminCourseAnnouncement.action.deleteAllAnnouncements(annment.body)
    })
  })
})
