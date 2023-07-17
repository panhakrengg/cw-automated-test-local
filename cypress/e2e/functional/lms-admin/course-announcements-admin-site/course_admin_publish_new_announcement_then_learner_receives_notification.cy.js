import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import AdminCourseAnnouncement from '../../../../classes/lms-admin/course-announcement/base/AdminCourseAnnouncement'
import LearnerCourseAnnouncement from '../../../../classes/lms-admin/course-announcement/base/LearnerCourseAnnouncement'
import CourseAnnouncementsYaml from '../../../../classes/lms-admin/course-announcement/base/mock/CourseAnnouncementsYaml'
import WebNotification from '../../../../classes/notification/WebNotification'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  const adminCourseAnnouncement = new AdminCourseAnnouncement()
  const courseAnnouncementsYaml = new CourseAnnouncementsYaml()
  const learnerCourseAnnouncement = new LearnerCourseAnnouncement()
  const webNotification = new WebNotification()

  context(Story.courseAnnouncementAdminSite, () => {
    let course, courseName, annment, annmentBody

    before(() => {
      courseAnnouncementsYaml.getCourseFuncForCreateAnnouncement((data) => {
        course = data
        courseName = course.name.value
        annment = course.announcements.auNotifyToday
        annmentBody = annment.body
      })
    })

    after(() => {
      ReportDefect.markCwDefect(
        'There is warning popup when there is no previously published course announcement!'
      )
    })

    it('Course admin publish new announcement then learner receives notification', () => {
      Story.ticket('QA-1828', ['CW-17944'])
      adminCourseAnnouncement.login.toCourseAnnouncementsAsCourseAdminTressie(course)

      cy.logInTestCase('Reset: remove announcement')
      adminCourseAnnouncement.action.deleteAllAnnouncements(annmentBody)

      cy.logInTestCase('Create and publish announcement')
      adminCourseAnnouncement.action.createThenPublishAnnouncement(annment)

      cy.logInTestCase('Learner receive notification')
      SignInAs.learnerLitzy()
      webNotification.verifyReceiveCourseAnnouncement(courseName, annmentBody)
      webNotification.clickCourseAnnouncement(courseName)

      cy.logInTestCase('Able to see the announcement')
      learnerCourseAnnouncement.assertion.expectToSeeAnnouncement(annmentBody)
    })
  })
})
