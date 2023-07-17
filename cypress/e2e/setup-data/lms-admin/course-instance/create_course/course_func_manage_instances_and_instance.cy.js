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
    new YamlHelper('lms-admin/course-instance/archive-instance')
      .read()
      .its('CourseData.courseFuncManageInstance')
      .then((courseFuncManageInstance) => {
        courseObj = courseFuncManageInstance
        instanceObj = courseFuncManageInstance.funcArchiveInstance
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseInstance, () => {
    it('Course Func Manage Instance & Func Archive Instance', () => {
      context('Setup course "Course Func Manage Instance"', () => {
        setupCourse.setCourseObject(courseObj)

        setupCourse.createNewCourseThenPublish()
        setupCourse.addUsers()
        setupCourse.changeAdminRole()
      })
      context('Setup instance "Func Archive Instance"', () => {
        setupInstance.setInstanceObject(instanceObj)
        setupInstance.createNewInstanceThenPublishByClickButton()
      })
    })
  })
})
