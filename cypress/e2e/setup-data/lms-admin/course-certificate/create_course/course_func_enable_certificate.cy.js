import Epic from '../../../../../classes/Epic'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import Story from '../../../../../classes/Story'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    new YamlHelper('lms-admin/course-certificate/course-certificate')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.courseFuncEnableCertificate
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
