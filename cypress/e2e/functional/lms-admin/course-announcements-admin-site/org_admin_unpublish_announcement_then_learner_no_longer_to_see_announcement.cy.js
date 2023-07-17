import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import AdminCourseAnnouncement from '../../../../classes/lms-admin/course-announcement/base/AdminCourseAnnouncement'
import LearnerCourseAnnouncement from '../../../../classes/lms-admin/course-announcement/base/LearnerCourseAnnouncement'
import CourseAnnouncementsYaml from '../../../../classes/lms-admin/course-announcement/base/mock/CourseAnnouncementsYaml'

describe(Epic.LmsAdmin, () => {
  const adminCourseAnnouncement = new AdminCourseAnnouncement()
  const courseAnnouncementsYaml = new CourseAnnouncementsYaml()
  const learnerCourseAnnouncement = new LearnerCourseAnnouncement()

  context(Story.courseAnnouncementAdminSite, () => {
    let course, instanceId, annmentBody

    before(() => {
      courseAnnouncementsYaml.getCourseFuncUnpublishAnnouncement((data) => {
        course = data
        const instance = course.staticInstanceForUnpublishAnnouncement
        instanceId = courseAnnouncementsYaml.getUrlId(instance)

        annmentBody = course.announcements.forUnpublish.body
      })
    })

    it('Org Admin unpublish announcement then learner no longer to see announcement', () => {
      Story.ticket('QA-1892')
      adminCourseAnnouncement.login.toCourseAnnouncementsAsOrgAdminAmy(course)

      cy.logInTestCase('Reset: unpublish announcement')
      adminCourseAnnouncement.action.clickAnnouncement(annmentBody)
      adminCourseAnnouncement.action.publishAnnouncement()

      cy.logInTestCase('Publish announcement')
      adminCourseAnnouncement.action.unpublishAnnouncement()

      cy.logInTestCase('Learner no longer to see the announcement')
      learnerCourseAnnouncement.action.visitCourseInstanceOverview(instanceId)
      learnerCourseAnnouncement.assertion.expectNotToSeeAnnouncement()
    })
  })
})
