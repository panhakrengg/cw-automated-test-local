import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj
  const setupCourse = new SetUpCourse()
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    new YamlHelper('lms-admin/org-course-instance-activities/instance-activities')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.courseFuncActivityFromLibrary
        instanceObj = courseObj.funcSPActivityElearning
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Setup instance "funcSPActivityElearning"', () => {
      setupInstance.setCourseName(courseObj.name.value)
      setupInstance.setInstanceObject(instanceObj)

      setupInstance.createNewInstanceThenPublishFromManageCourse()
    })
  })
})
