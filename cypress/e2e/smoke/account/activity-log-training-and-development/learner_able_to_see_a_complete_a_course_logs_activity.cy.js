import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import Environment from '../../../../classes/base/Environment'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

const TRAINING_AND_DEVELOPMENT = ActivityCategories.TRAINING_AND_DEVELOPMENT

describe(Epic.Account, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const accountYamlHelper = new YamlHelper('account')
  const activityLogs = new ActivityLogs()
  const environment = new Environment()

  context(Story.activityTrainingAndDevelopment, () => {
    let auAcMemberName
    let ccFuncTrackingActivityLog
    let physicalClassCompletedDate
    let courseTitle
    before(() => {
      yamlHelper
        .read()
        .its('Users.uat')
        .then((user) => {
          const auAcMember = user.auAcMember
          auAcMemberName = auAcMember.familyName + ' ' + auAcMember.givenName
        })
      accountYamlHelper
        .read()
        .its('Courses')
        .then((course) => {
          ccFuncTrackingActivityLog = course.ccFuncTrackingActivityLog
          physicalClassCompletedDate =
            ccFuncTrackingActivityLog.courseInstances.physicalClass.completed.user.auAcMember[
              environment.getEnvPrefix()
            ]
          courseTitle = environment.isPrd()
            ? 'CC Function Tracking Activity Log'
            : ccFuncTrackingActivityLog.title
        })
    })

    it('Learner able to see a complete a course logs activity - Training & Development', () => {
      Story.ticket('QA-1451')
      context('Navigate to training and development activity log', () => {
        AccountUserStub.signInAsAuAcMember()
        activityLogs.accessActivityLog()
        activityLogs.clickFilterActivityBy(TRAINING_AND_DEVELOPMENT)
      })

      context('Verify completed the course', () => {
        activityLogs.containLogCompletedTheCourse(
          auAcMemberName,
          courseTitle,
          physicalClassCompletedDate.time,
          physicalClassCompletedDate.date
        )
      })
    })
  })
})
