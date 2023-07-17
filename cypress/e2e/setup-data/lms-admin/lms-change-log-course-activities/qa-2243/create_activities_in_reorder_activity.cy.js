import Epic from '../../../../../classes/Epic'
import SetUpCourseActivity from '../../../../../classes/lms/admin/course-instance/SetUpCourseActivity'
import Story from '../../../../../classes/Story'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let instance, activities
  const setupActivity = new SetUpCourseActivity()

  beforeEach(() => {
    new YamlHelper('lms-admin/lms-change-log/log-course-activity')
      .read()
      .then(({ EditActivities }) => {
        instance = EditActivities.courseActivitiesLog.instanceReorderLog
        activities = instance.activities
      })
    setupActivity.manageCourse.setItcFetchManageCourse()
  })

  const goToCourseActivities = () => {
    SignInAs.courseAdminGiles(setupActivity.manageCourse.getManageCourseUrl())
    setupActivity.searchInstanceThenGoToCourseActivities(instance.title)
  }

  context(Story.lmsChangeLogCourseActivities, () => {
    it('Create physical activity "Train at school playground" in reorder instance', () => {
      goToCourseActivities()
      setupActivity.createPhysicalActivity(activities.physicalClass)
    })
    it('Create virtual class activity "Talking together" in reorder instance', () => {
      goToCourseActivities()
      setupActivity.createVirtualActivity(activities.virtualClass)
    })
    it('Create quiz activity "Small quiz"in reorder instance', () => {
      goToCourseActivities()
      setupActivity.createQuizActivity(activities.quiz)
    })
  })
})
