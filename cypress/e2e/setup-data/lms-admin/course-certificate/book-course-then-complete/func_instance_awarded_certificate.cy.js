import SetUpBooking from '../../../../../classes/course/SetUpBooking'
import Epic from '../../../../../classes/Epic'
import SetupCompleteActivity from '../../../../../classes/lms/learner/course-instance/SetupCompleteActivity'
import Story from '../../../../../classes/Story'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj
  const setupBooking = new SetUpBooking()
  const setupCompleteActivity = new SetupCompleteActivity()

  before(() => {
    new YamlHelper('lms-admin/course-certificate/course-certificate')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.courseFuncEditDefaultCertificate
        instanceObj = courseObj.funcInstanceAwardedBeforeEditing
      })
    new SignInLmsAs().istMember_Mallory()
  })

  context(Story.courseCertificate, () => {
    it('Book course "Func Instance awarded certificate before editing certificate"', () => {
      setupBooking.setCourseObject(courseObj)
      setupBooking.setInstanceObject(instanceObj)
      setupBooking.bookCourseBySearchFromGlobal()

      setupCompleteActivity.completeHyperlink(
        instanceObj.activities.value.beginnerTennisLesson.title.value
      )
      setupCompleteActivity.addCertificateToProfile()
    })
  })
})
