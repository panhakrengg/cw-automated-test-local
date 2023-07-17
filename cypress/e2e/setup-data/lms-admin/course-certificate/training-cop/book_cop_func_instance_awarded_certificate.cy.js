import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpBooking from '../../../../../classes/course/SetUpBooking'
import SetupCompleteActivity from '../../../../../classes/lms/learner/course-instance/SetupCompleteActivity'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj
  const setupBooking = new SetUpBooking()
  const setupCompleteActivity = new SetupCompleteActivity()

  before(() => {
    new YamlHelper('lms-admin/course-certificate/course-certificate')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.copCourseFuncEditExternalCertificate
        instanceObj = courseObj.copFuncInstanceAwardedBeforeEditing
      })
    SignInAs.nonOrgMember_Virgie()
  })

  context(Story.courseCertificate, () => {
    it('Book course "CoP Func Instance awarded certificate before editing certificate"', () => {
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
