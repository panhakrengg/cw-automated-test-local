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
        annment = data.announcements.auAnnounceAllInstances
      })
      cy.stubUser(UserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_AD_TRESSIE)
      cy.get('@stubUser').then((user) => {
        authorName = user.fullName
      })
    })

    it('Course Admin create course announcement by selecting "All course instances"', () => {
      Story.ticket('QA-971')
      adminCourseAnnouncement.login.toCourseAnnouncementsAsCourseAdminTressie(course)

      cy.logInTestCase('Reset: remove announcement')
      adminCourseAnnouncement.action.deleteAllAnnouncements(annment.body)

      cy.logInTestCase('Create Course Announcement')
      adminCourseAnnouncement.action.createNewAnnouncement(annment)

      cy.logInTestCase('Announcement is created successfully')
      adminCourseAnnouncement.assertion.verifyAnnouncementCreateSuccessfully(annment)

      cy.logInTestCase('Reload')
      adminCourseAnnouncement.action.reloadPage()
      adminCourseAnnouncement.assertion.verifyAnnouncementRow(annment, authorName)

      cy.logInTestCase('Reset: remove announcement')
      adminCourseAnnouncement.action.deleteAllAnnouncements(annment.body)
    })
  })
})
