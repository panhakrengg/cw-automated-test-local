import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    new YamlHelper('lms-admin/org-course-instance-activities/instance-activities')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.courseFuncActivityToLibrary
        instanceObj = courseObj.funcAddElearningToLibrary
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Setup instance "funcAddElearningToLibrary"', () => {
      setupInstance.setCourseName(courseObj.name.value)
      setupInstance.setInstanceObject(instanceObj)
      setupInstance.createNewInstanceFromManageCourse()
    })
  })
})
