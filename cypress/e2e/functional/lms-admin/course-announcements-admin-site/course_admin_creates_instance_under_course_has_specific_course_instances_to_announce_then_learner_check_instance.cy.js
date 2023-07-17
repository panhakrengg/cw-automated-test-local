import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import AdminCourseAnnouncement from '../../../../classes/lms-admin/course-announcement/base/AdminCourseAnnouncement'
import LearnerCourseAnnouncement from '../../../../classes/lms-admin/course-announcement/base/LearnerCourseAnnouncement'
import CourseAnnouncementsYaml from '../../../../classes/lms-admin/course-announcement/base/mock/CourseAnnouncementsYaml'
import PeopleActions from '../../../../classes/lms-admin/course-instance-people/actions/PeopleActions'
import ManageCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ManageCourseInstanceActions'
import ModifyCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ModifyCourseInstanceActions'
import CourseInstanceLogin from '../../../../classes/lms-admin/course-instance/admin/mock/CourseInstanceLogin'
import CourseInstanceOverviewQueries from '../../../../classes/lms-admin/course-instance/admin/queries/CourseInstanceOverviewQueries'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const courseAnnmentYaml = new CourseAnnouncementsYaml()

  const adminCourseAnnouncement = new AdminCourseAnnouncement()
  const instanceLogin = new CourseInstanceLogin()
  const instanceOverviewQueries = new CourseInstanceOverviewQueries()
  const instancePeopleActions = new PeopleActions()
  const learnerCourseAnnouncement = new LearnerCourseAnnouncement()
  const manageInstanceActions = new ManageCourseInstanceActions()
  const modifyInstanceActions = new ModifyCourseInstanceActions()

  context(Story.courseAnnouncementAdminSite, () => {
    let courseId, courseInstance, instanceTitle
    let learner, annment, annmentBody, totalInstance

    before(() => {
      courseAnnmentYaml.getCourseFuncNewInstanceUnderAnnouncement((data) => {
        const course = data
        courseInstance = course.auNewInstanceNoAnnouncement
        courseId = courseAnnmentYaml.getUrlId(course)
        instanceTitle = courseInstance.title.value

        totalInstance = course.announcements.total
        annment = course.announcements.specificInstance
        annmentBody = annment.body
      })
      cy.stubUser(UserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_AD_TRESSIE)
      cy.get('@stubUser').then((user) => {
        learner = [user.screenName]
      })
    })

    it('Course Admin creates instance under course has "Specific course instances" to announce then learner check  instance', () => {
      Story.ticket('QA-1753')
      instanceLogin.toManageCourseInstanceAsCourseAdminTressie(courseId)

      cy.logInTestCase('Remove existing course instance')
      manageInstanceActions.archiveAndDeleteCourseInstance(instanceTitle)

      cy.logInTestCase('Create New Course Instance')
      manageInstanceActions.clickButtonCreateNewInstance()
      modifyInstanceActions.createCourseInstance(courseInstance)
      instanceOverviewQueries.getIdThenDefineAlias()

      cy.logInTestCase('Add learner to instance')
      instancePeopleActions.addLearnerByClickingPeopleNav(learner)

      cy.logInTestCase('Go to course announcements list')
      adminCourseAnnouncement.action.visitCourseAnnouncements(courseId)
      adminCourseAnnouncement.assertion.expectToSeeTotalAnnounceTo(annmentBody, totalInstance)

      cy.logInTestCase('Edition announcement screen')
      adminCourseAnnouncement.action.clickAnnouncement(annmentBody)
      adminCourseAnnouncement.assertion.expectSpecificInstancesTable(annment)

      cy.logInTestCase('Learner go to booked course instance detail')
      instanceOverviewQueries.getId().then((courseInstanceId) => {
        learnerCourseAnnouncement.action.visitCourseInstanceOverview(courseInstanceId)
        learnerCourseAnnouncement.assertion.expectNotToSeeAnnouncement()
      })
    })
  })
})
