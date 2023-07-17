import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-instance').read().then(({ LearnerResources }) => {
      courseObj = LearnerResources.courseFuncInstanceLog
      instanceObj = courseObj.instanceNewFileFolder
    })
  })

  context(Story.lmsChangeLogCourseInstance, () => {
    it('Setup instance "Instance for new file & folder resource to check log"', () => {
      SignInAs.courseAdminGiles()
      setupInstance.createNewInstanceFromManageCourse(courseObj, instanceObj)
      setupInstance.addFacilitators()
    })
  })
})
