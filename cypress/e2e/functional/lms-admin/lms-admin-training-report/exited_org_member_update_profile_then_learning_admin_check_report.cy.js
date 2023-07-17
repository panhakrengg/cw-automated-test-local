import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import TrainingReportsBase from '../../../../classes/lms/admin/training-report/base/TrainingReportsBase'
import { TrainingReportColumnsByRole } from '../../../../classes/lms/admin/training-report/constants/TrainingReportsConstants'
import ContactInfo from '../../../../classes/my-profile/ContactInfo'
import ProfileInfo from '../../../../classes/my-profile/ProfileInfo'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const contactInfo = new ContactInfo()
  const profileInfo = new ProfileInfo()

  const trainingReport = new TrainingReportsBase()

  let exitedOrgMemberSimo, screenName
  let course, courseName
  let instanceBooked, instanceCompleted

  before(() => {
    cy.stubUser(UserRole.ORG_MEMBER.EXIT_SIMO).then((user) => {
      exitedOrgMemberSimo = user
      screenName = user.screenName
    })
    trainingReport.yaml.getCourseInFullCatalog((data) => {
      course = data
      courseName = course.name

      instanceBooked = course.instanceExitedOrgMemberBooked
      instanceCompleted = course.instanceExitedOrgMemberCompleted
    })
  })
  context(Story.lmsAdminTrainingReports, () => {
    it('Exited org member update profile info then Learning admin check the user in report', () => {
      Story.ticket('QA-2157')

      cy.logInTestCase('Exited reset profile info')
      profileInfo.login.toProfilePageAsExitedOrgMemberSimo()

      contactInfo.clickEditContactInfo()
      contactInfo.resetGivenFamilyName(exitedOrgMemberSimo)

      cy.logInTestCase('Exited org member update profile info')
      contactInfo.clearProfile()
      const userProfile = contactInfo.updateProfile(exitedOrgMemberSimo, true)
      contactInfo.clickUpdateContactInfo()

      cy.logInTestCase('Learning admin check in training report')
      trainingReport.login.toTopLevelAsLearningAdmin()

      trainingReport.actions.searchCoursesLearners(screenName)
      trainingReport.assertions.expectTotalRecordAtLeast(2)
      trainingReport.assertions.verifyAfterUserUpdateProfile(
        exitedOrgMemberSimo,
        userProfile,
        instanceBooked
      )
      trainingReport.assertions.verifyAfterUserUpdateProfile(
        exitedOrgMemberSimo,
        userProfile,
        instanceCompleted
      )
    })
  })
})
