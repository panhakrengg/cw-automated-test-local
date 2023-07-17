import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupAcceptConsent from '../../../../../classes/consent/setup-data/SetupAcceptConsent'
import SetUpBooking from '../../../../../classes/course/SetUpBooking'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let courseName, instanceName
  const setupBooking = new SetUpBooking()
  const setupAcceptConsent = new SetupAcceptConsent()

  before(() => {
    cy.stubCourse(
      'lms-admin/lms-admin-manage-consent/course-consent',
      'courseForDownloadingConsent'
    ).then((course) => {
      courseName = course.name
      instanceName = course.instanceLearnerGivenConsent.title
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Learners give consent to "Instance Learner given consent"', () => {
      cy.logInTestCase('Litzy give all consents item')
      SignInAs.learnerLitzy()
      setupBooking.searchCourseThenGoToBookedInstance(courseName, instanceName)
      setupAcceptConsent.acceptAllItems()
      setupAcceptConsent.clickYesIAgreeCourse()

      cy.logInTestCase("Mallory don't give optional consent item")
      SignInAs.learnerMallory()
      setupBooking.searchCourseThenGoToBookedInstance(courseName, instanceName)
      setupAcceptConsent.acceptButExceptOptionalItem()
      setupAcceptConsent.clickYesIAgreeCourse()
    })
  })
})
