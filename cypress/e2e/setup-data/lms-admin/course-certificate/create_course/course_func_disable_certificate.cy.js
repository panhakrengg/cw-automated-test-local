import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    new YamlHelper('lms-admin/course-certificate/course-certificate')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.courseFuncDisableCertificate
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseCertificate, () => {
    it('Course Func for Enable Certificate', () => {
      setupCourse.setCourseObject(courseObj)

      setupCourse.createNewCourseThenPublish()
      setupCourse.addAdmins()
    })
  })
})
