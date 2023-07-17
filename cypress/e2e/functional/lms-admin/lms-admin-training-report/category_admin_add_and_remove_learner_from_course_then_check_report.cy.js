import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import InstancePeopleBase from '../../../../classes/lms/admin/course-instance/people/base/InstancePeopleBase'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const { actions: actionsPeople, login: loginPeople } = new InstancePeopleBase()
  const { actions, assertions, yaml } = new TrainingReportsBase()

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
      instance = course.instanceForAdminRemoveLearner
      instanceTitle = instance.title

      courseId = yaml.getUrlId(course)
      instanceId = yaml.getUrlId(instance)
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Category admin add and remove learner from course instance then check report', () => {
      Story.ticket('QA-2173')

      cy.logInTestCase('Reset data')
      loginPeople.toOrgLmsAsCategoryAdminKenton(courseId, instanceId)
      actionsPeople.removeLearner(email)

      cy.logInTestCase('Add learner to instance')
      actionsPeople.addLearner(screenName)

      cy.logInTestCase('Check report after adding')
      actions.visitTopLevel()
      actions.searchCoursesLearners(`"${instanceTitle}"`)
      assertions.expectTotalRecordAtLeast(1)
      assertions.expectRecordWithLearnerAndInstanceInfo(learner, instance, courseName)

      cy.logInTestCase('Remove learner from instance')
      actionsPeople.visit(courseId, instanceId)
      actionsPeople.removeLearner(email)

      cy.logInTestCase('Check report after removing')
      actions.visitTopLevel()
      actions.searchCoursesLearners(`"${instanceTitle}"`)
      assertions.expectNoRecord()
    })
  })
})
