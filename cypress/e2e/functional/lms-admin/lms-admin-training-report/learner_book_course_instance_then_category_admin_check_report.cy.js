import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Booking from '../../../../classes/course/Booking'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import InstancePeopleBase from '../../../../classes/lms/admin/course-instance/people/base/InstancePeopleBase'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, { retries: 1 }, () => {
  const { actions: actionsPeople, login: loginPeople } = new InstancePeopleBase()
  const { actions, assertions, constantColumns, login, yaml } = new TrainingReportsBase()
  const addColumn = [constantColumns.PERCENTAGE_COMPLETE]

  let learner, email
  let course, courseId, courseName
  let instance, instanceId, instanceTitle

  before(() => {
    cy.stubUser(UserRole.LMS_USERS.LEANER.AU_LN_IST_MEM_DELPHIA).then((user) => {
      learner = user
      email = user.email
    })
    yaml.getCourseFuncForReport((data) => {
      course = data
      courseName = course.name
      instance = course.instanceForBooking
      instanceTitle = instance.title

      courseId = yaml.getUrlId(course)
      instanceId = yaml.getUrlId(instance)
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Learner book a course instance then category admin check the report', () => {
      Story.ticket('QA-2169')

      cy.logInTestCase('Reset data')
      loginPeople.toOrgLmsAsCategoryAdminKenton(courseId, instanceId)
      actionsPeople.removeLearner(email)

      cy.logInTestCase('Learner book course')
      SignInAs.learnerDelphia(new CourseDetail().getCatalogCourseDetailUrl(courseId))
      new Booking().bookByNameWithoutCheckNextScreen(instanceTitle)

      cy.logInTestCase('Learning admin check in training report')
      login.toTopLevelAsCategoryAdminKenton()
      actions.searchCoursesLearners(`"${instanceTitle}"`)
      actions.addColumns(addColumn)
      assertions.expectTotalRecordAtLeast(1)
      assertions.expectRecordWithLearnerAndInstanceInfo(learner, instance, courseName)
    })
  })
})
