import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const { actions, assertions, constantColumnCourseLevel, login, yaml } = new TrainingReportsBase()
  const defaultColumns = constantColumnCourseLevel.COURSE_ADMIN

  let learner, screenName, expectTotalRecord, course, courseId
  let instanceThereAre2Learners, instanceThereIs1Learner

  before(() => {
    cy.stubUser(UserRole.LMS_USERS.LEANER.AU_LN_CTG_MEM_QUESTIN).then((user) => {
      learner = user
      screenName = user.screenName
    })
    yaml.getSearchInReport((data) => {
      course = data.learnerQuentin.courses.courseHaveAdminLearnerBooked
      expectTotalRecord = course.totalRecordAtLeast
      instanceThereIs1Learner = course.instanceThereIs1Learner
      instanceThereAre2Learners = course.instanceThereAre2Learners
      courseId = yaml.getUrlId(course)
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Course admin search learner from report in Course level', () => {
      Story.ticket('QA-2151')

      login.toCourseLevelAsCourseAdminTressie(courseId)
      actions.searchLearners(screenName)
      assertions.expectColumnHeaders(defaultColumns)
      assertions.expectSearchResultLabel(screenName)
      assertions.expectTotalRecordAtLeast(expectTotalRecord)
      assertions.expectRecordWithLearnerAndInstanceInfo(learner, instanceThereIs1Learner)
      assertions.expectRecordWithLearnerAndInstanceInfo(learner, instanceThereAre2Learners)
    })
  })
})
