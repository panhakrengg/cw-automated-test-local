import Epic from '../../../../../classes/Epic'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import Story from '../../../../../classes/Story'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let instanceTitle, feedback
  const setupActivity = new SetUpCourseActivity()

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-course-activity')
      .read()
      .then(({ AddActivityToLibrary }) => {
        const instance = AddActivityToLibrary.courseActivitiesLog.instanceAddToLibraryLog
        instanceTitle = instance.title
        feedback = instance.activities.feedback
      })
  })

  context(Story.lmsChangeLogCourseActivities, () => {
    it('Create feedback activity "AU Feedback from Course Activity"', () => {
      setupActivity.manageCourse.setItcFetchManageCourse()
      SignInAs.courseAdminGiles(setupActivity.manageCourse.getManageCourseUrl())

      setupActivity.searchInstanceThenGoToCourseActivities(instanceTitle)
      setupActivity.createFeedbackActivity(feedback)
    })
  })
})
