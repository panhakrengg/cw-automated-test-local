import Epic from '../../../../../classes/Epic'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import Story from '../../../../../classes/Story'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let instanceTitle, quiz
  const setupActivity = new SetUpCourseActivity()

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-course-activity')
      .read()
      .then(({ EditActivities }) => {
        const instance = EditActivities.courseActivitiesLog.instanceEditActivitiesLog
        instanceTitle = instance.title
        quiz = instance.activities.quiz.previous
      })
  })

  context(Story.lmsChangeLogCourseActivities, () => {
    it('Create quiz activity "Small quiz"', () => {
      setupActivity.manageCourse.setItcFetchManageCourse()
      SignInAs.courseAdminGiles(setupActivity.manageCourse.getManageCourseUrl())

      setupActivity.searchInstanceThenGoToCourseActivities(instanceTitle)
      setupActivity.createQuizActivity(quiz)
    })
  })
})
