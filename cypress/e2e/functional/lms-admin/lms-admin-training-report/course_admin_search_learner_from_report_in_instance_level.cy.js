import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const { actions, assertions, constantColumnInstanceLevel, login, yaml } =
    new TrainingReportsBase()
  const defaultColumns = constantColumnInstanceLevel.COURSE_ADMIN
  const notSeeColumns = constantColumnInstanceLevel.COURSE_ADMIN_NOT_SEE

  let learner, screenName, course, courseId
  let instanceThereAre2Learners, instanceId

  before(() => {
    cy.stubUser(UserRole.LMS_USERS.LEANER.AU_LN_CTG_MEM_QUESTIN).then((user) => {
      learner = user
      screenName = user.screenName
    })
    yaml.getSearchInReport((data) => {
      course = data.learnerQuentin.courses.courseHaveAdminLearnerBooked
      instanceThereAre2Learners = course.instanceThereAre2Learners

      courseId = yaml.getUrlId(course)
      instanceId = yaml.getUrlId(instanceThereAre2Learners)
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Course admin search learner from report in Instance level', () => {
      Story.ticket('QA-2152')

      login.toInstanceLevelAsCourseAdminTressie(courseId, instanceId)
      actions.searchLearners(screenName)

      assertions.expectRecordEqualToSearchResult()
      assertions.expectColumnHeaders(defaultColumns)
      assertions.expectCannotSeeColumnHeaders(notSeeColumns)
      assertions.expectSearchResultLabel(screenName)
      assertions.expectTotalRecordAtLeast(1)
      assertions.expectRecordWithLearnerInfo(learner)
    })
  })
})
