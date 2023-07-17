import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import ProfileInfo from '../../../../classes/my-profile/ProfileInfo'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

const PROFILE_UPDATES = ActivityCategories.PROFILE_UPDATES

describe(Epic.Account, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const accountYamlHelper = new YamlHelper('account')
  const faker = new Faker()
  const activityLogs = new ActivityLogs()
  const profileInfo = new ProfileInfo()

  context(Story.activityTrainingAndDevelopment, () => {
    let auAcFuncMemberName
    let ccFuncTrackingActivityLog
    before(() => {
      yamlHelper
        .read()
        .its('Users.uat')
        .then((user) => {
          const auAcFuncMember = user.auAcFuncMember
          auAcFuncMemberName = auAcFuncMember.familyName + ' ' + auAcFuncMember.givenName
        })
      accountYamlHelper
        .read()
        .its('Courses')
        .then((courses) => {
          ccFuncTrackingActivityLog = courses.ccFuncTrackingActivityLog
          faker.setPathFixture(ccFuncTrackingActivityLog)
          faker.setPathFixture(ccFuncTrackingActivityLog.courseInstances.virtualClass)
        })
    })

    it('Learner update profile expertise certificate then logs activity - Training & Development', () => {
      Story.ticket('QA-1379')
      const activities = [
        {
          name: ccFuncTrackingActivityLog.title,
          oldVisibility: 'Hide',
          newVisibility: 'Show',
        },
      ]

      context('Go to my profile and open expertise tab', () => {
        AccountUserStub.signInAsAuAcFuncMember()
        profileInfo.visitMyProfile()
        profileInfo.clickExpertiseAndQualificationTab()
      })

      context('Reset data', () => {
        profileInfo.disableCourseCertificateIfEnabledBy(ccFuncTrackingActivityLog.title)
      })

      context(`Update certificate on my profile`, () => {
        profileInfo.clickExpertiseAndQualificationTab()
        profileInfo.enableCourseCertificateBy(ccFuncTrackingActivityLog.title)
      })

      context('Navigate to training and development activity log', () => {
        activityLogs.accessActivityLog()
        activityLogs.clickFilterActivityBy(PROFILE_UPDATES)
      })

      context('Verify update certificate shown in my profile', () => {
        activityLogs.containLogUpdateCertificateShowInMyProfile(
          auAcFuncMemberName,
          activities,
          'updated certificates shown in profile.',
          activityLogs.getCurrentDate()
        )
      })
    })

    it('Learner update profile expertise certificate visibility then logs activity - Training & Development', () => {
      Story.ticket('QA-1380')
      const activities = [
        {
          name: 'Visibility',
          oldVisibility: 'Platform',
          newVisibility: 'Network',
        },
      ]

      cy.logInTestCase('Go to my profile and open expertise tab')
      AccountUserStub.signInAsAuAcFuncMember()
      profileInfo.visitMyProfile()
      profileInfo.clickExpertiseAndQualificationTab()

      cy.logInTestCase('Reset data')
      profileInfo.updateShowCertificateVisibilityOnMyProfile(
        ccFuncTrackingActivityLog.title,
        'Only Me'
      )
      profileInfo.updateShowCertificateVisibilityOnMyProfile(
        ccFuncTrackingActivityLog.title,
        'Platform'
      )

      cy.logInTestCase(`Update certificate on my profile`)
      profileInfo.updateShowCertificateVisibilityOnMyProfile(
        ccFuncTrackingActivityLog.title,
        'Network'
      )

      cy.logInTestCase('Navigate to training and development activity log')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(PROFILE_UPDATES)

      cy.logInTestCase('Verify update certificate shown in my profile')
      activityLogs.containLogUpdateCertificateShowInMyProfile(
        auAcFuncMemberName,
        activities,
        'updated profile certificates visibility.',
        activityLogs.getCurrentDate()
      )
    })
  })
})
