import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import InstancePeopleBase from '../../../../classes/lms/admin/course-instance/people/base/InstancePeopleBase'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'
import MyLearningActions from '../../../../classes/lms/learner/actions/MyLearningActions'
import MyLearningLogin from '../../../../classes/lms/learner/base/mock/MyLearningLogin'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, { retries: 1 }, () => {
  const { actions: actionsPeople, login: loginPeople } = new InstancePeopleBase()
  const { actions, assertions, login, yaml } = new TrainingReportsBase()

  let learner, email, screenName
  let course, courseId, courseName
  let instance, instanceId, instanceTitle

  before(() => {
    cy.stubUser(UserRole.LMS_USERS.LEANER.AU_LN_IST_MEM_DELPHIA).then((user) => {
      learner = user
      email = user.email
      screenName = user.screenName
    })
    yaml.getCourseFuncForReport((data) => {
      course = data
      courseName = course.name
      instance = course.instanceForWithdraw
      instanceTitle = instance.title

      courseId = yaml.getUrlId(course)
      instanceId = yaml.getUrlId(instance)
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Learner withdraw course instance then learning admin check report', () => {
      Story.ticket('QA-2172')

      cy.logInTestCase('Reset data')
      loginPeople.toOrgLmsAsLearningAdmin(courseId, instanceId)
      actionsPeople.removeLearner(email)
      actionsPeople.addLearner(screenName)

      cy.logInTestCase('Learner withdraw course')
      new MyLearningLogin().asLearnerDelphia()
      new MyLearningActions().withdrawCourse(courseName, instanceTitle)

      cy.logInTestCase('Learning admin check in training report')
      login.toTopLevelAsCategoryAdminKenton()
      actions.searchCoursesLearners(`"${instanceTitle}"`)
      assertions.expectTotalRecordAtLeast(1)
      assertions.expectRecordWithLearnerAndInstanceInfo(learner, instance, courseName)

      cy.logInTestCase('Reset data')
      loginPeople.toOrgLmsAsLearningAdmin(courseId, instanceId)
      actionsPeople.removeLearner(email)
    })
  })
})
