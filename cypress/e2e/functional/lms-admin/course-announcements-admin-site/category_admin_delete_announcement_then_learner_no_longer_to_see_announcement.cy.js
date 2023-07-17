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
    let course, instanceId, annment, annmentBody

    before(() => {
      courseAnnouncementsYaml.getCourseFuncRemoveAnnouncement((data) => {
        course = data
        const instance = course.staticInstanceForRemoveAnnouncement
        instanceId = courseAnnouncementsYaml.getUrlId(instance)

        annment = course.announcements.forRemove
        annmentBody = annment.body
      })
    })

    it('Category Admin delete announcement then learner no longer to see announcement', () => {
      Story.ticket('QA-1890')
      adminCourseAnnouncement.login.toCourseAnnouncementsAsCategoryAdminKenton(course)

      cy.logInTestCase('Reset: create and publish the announcement')
      adminCourseAnnouncement.action.deleteAllAnnouncements(annmentBody)
      adminCourseAnnouncement.action.createThenPublishAnnouncement(annment)
      adminCourseAnnouncement.action.reloadPage()

      cy.logInTestCase('Delete announcement')
      adminCourseAnnouncement.action.deleteAnnouncement(annmentBody)
      adminCourseAnnouncement.assertion.expectAnnouncementDeleted(annmentBody)

      cy.logInTestCase('Learner no longer to see announcement')
      learnerCourseAnnouncement.action.visitCourseInstanceOverview(instanceId)
      learnerCourseAnnouncement.assertion.expectNotToSeeAnnouncement()
    })
  })
})
