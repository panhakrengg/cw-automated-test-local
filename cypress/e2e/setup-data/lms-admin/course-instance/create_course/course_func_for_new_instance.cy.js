import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setup = new SetUpCourse()

  before(() => {
    new YamlHelper('lms-admin/course-instance/create-new-instances')
      .read()
      .its('CourseData.courseFuncForNewInstance')
      .then((courseFuncForNewInstance) => {
        courseObj = courseFuncForNewInstance
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseInstance, () => {
    it('Course Func For New Instance', () => {
      setup.setCourseObject(courseObj)

      setup.createNewCourseThenPublish()
      setup.addUsers()
      setup.changeAdminRole()
    })
  })
})
