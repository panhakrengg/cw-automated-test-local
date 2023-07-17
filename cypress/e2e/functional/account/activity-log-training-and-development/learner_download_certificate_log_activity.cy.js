import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Story from '../../../../classes/Story'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

const TRAINING_AND_DEVELOPMENT = ActivityCategories.TRAINING_AND_DEVELOPMENT

describe(Epic.Account, { retries: 1 }, () => {
  const activityLogs = new ActivityLogs()
  const courseDetail = new CourseDetail()

  context(Story.activityTrainingAndDevelopment, () => {
    let auAcFuncMemberName
    let downloadCourseCert
    let downloadCertCIId

    before(() => {
      cy.stubUser(UserRole.ACTIVITY_LOG.AU_MARLENEREMPEL)
      cy.get('@stubUser').then((user) => {
        auAcFuncMemberName = user.fullName
      })
      cy.stubCourse('account', 'ccTrackingDownloadCourseCertificateActivityLog')
      cy.get('@course').then((course) => {
        downloadCourseCert = course
      })
      cy.stubCourseInstance(
        'account',
        'ccTrackingDownloadCourseCertificateActivityLog',
        'physicalClass'
      )
      cy.get('@courseInstance').then((courseInstance) => {
        downloadCertCIId = courseInstance.id
      })
    })

    it('Learner download a course certificate then logs activity - Training & Development', () => {
      Story.ticket('QA-1420')

      cy.logInTestCase(`Booking course instance`)
      AccountUserStub.signInAsAuMarleneRempel()
      courseDetail.visitCourseInstanceDetail(downloadCertCIId)
      courseDetail.clickViewCertificate()

      cy.logInTestCase('Navigate to training and development activity log')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(TRAINING_AND_DEVELOPMENT)

      cy.logInTestCase('Verify download certificate activity log')
      activityLogs.containLogDownloadCertificateCourse(
        auAcFuncMemberName,
        downloadCourseCert.title,
        activityLogs.getCurrentDate()
      )
    })
  })
})
