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
      courseAnnouncementsYaml.getCourseFuncPublishAnnouncement((data) => {
        course = data
        const instance = course.staticInstanceForPublishAnnouncement
        instanceId = courseAnnouncementsYaml.getUrlId(instance)

        annmentBody = course.announcements.forPublish.body
      })
    })

    it('Learning Admin publish existing announcement then learner able to see announcement', () => {
      Story.ticket('QA-1891')
      adminCourseAnnouncement.login.toCourseAnnouncementsAsLearningAdminEmery(course)

      cy.logInTestCase('Reset: unpublish announcement')
      adminCourseAnnouncement.action.clickAnnouncement(annmentBody)
      adminCourseAnnouncement.action.unpublishAnnouncement()

      cy.logInTestCase('Publish announcement')
      adminCourseAnnouncement.action.publishAnnouncement()

      cy.logInTestCase('Learner able to see the announcement')
      learnerCourseAnnouncement.action.visitCourseInstanceOverview(instanceId)
      learnerCourseAnnouncement.assertion.expectToSeeAnnouncement(annmentBody)
    })
  })
})
