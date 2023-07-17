import Epic from '../../../../../classes/Epic'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import Story from '../../../../../classes/Story'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    new YamlHelper('lms-admin/org-course-instance-activities/instance-activities')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.courseFuncActivityFromLibrary
        instanceObj = courseObj.funcSOActivityHyperlink
        setupInstance.setOrgInstanceActivityYaml()
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Setup instance "funcSPActivityElearning"', () => {
      setupInstance.setCourseBaseYaml('courseFuncActivityFromLibrary')
      setupInstance.setCourseName(courseObj.name.value)
      setupInstance.setInstanceObject(instanceObj)
      setupInstance.createNewInstanceFromManageCourse()
    })
  })
})
