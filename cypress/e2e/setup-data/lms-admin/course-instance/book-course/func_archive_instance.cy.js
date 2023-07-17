import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpBooking from '../../../../../classes/course/SetUpBooking'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj
  const setupBooking = new SetUpBooking()

  before(() => {
    new YamlHelper('lms-admin/course-instance/archive-instance')
      .read()
      .its('CourseData.courseFuncManageInstance')
      .then((courseFuncManageInstance) => {
        courseObj = courseFuncManageInstance
        instanceObj = courseFuncManageInstance.funcArchiveInstance
      })
    new SignInLmsAs().istMember_Mallory()
  })

  context(Story.courseInstance, () => {
    it('Book course Func Archive Instance', () => {
      setupBooking.setCourseObject(courseObj)
      setupBooking.setInstanceObject(instanceObj)
      setupBooking.bookCourseBySearchFromGlobal()
    })
  })
})
