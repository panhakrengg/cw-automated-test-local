import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.Account, () => {
  const activityLogs = new ActivityLogs()
  context(Story.activityTrainingAndDevelopment, () => {
    let auAcOrgAdminName
    let courseName
    let consentForm
    before(() => {
      cy.stubUser(UserRole.ACTIVITY_LOG.AU_AC_ORG_ADMIN)
      cy.get('@stubUser').then((user) => {
        auAcOrgAdminName = user.fullName
      })
      cy.stubCourse('account', 'courseTrackingActivityLog')
      cy.get('@course').then((course) => {
        courseName = course.title
        consentForm = course.consent
      })
    })

    it('Course Administrator able to see consent activity log of use,disabled,enabled predefined consent form in a course under Org LMS', () => {
      Story.ticket('QA-1050')
      AccountUserStub.signInAsAuAcOrgAdmin()
      activityLogs.setPersonalCourseLogData(auAcOrgAdminName, consentForm, courseName)

      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(ActivityCategories.LEARNING_ADMINISTRATION)
      activityLogs.expectFoundDisabledCourseConsent()
      activityLogs.expectFoundEnabledCourseConsent()
      activityLogs.expectFoundUsedPredefinedCourseConsent()
    })
  })
})
