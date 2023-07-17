import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

const SECURITY = ActivityCategories.SECURITY

describe(Epic.Account, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const activityLogs = new ActivityLogs()

  context(Story.activityLogSecurity, () => {
    let auAcFuncMemberName
    let au2FaActivityLogName

    before(() => {
      yamlHelper
        .read()
        .its('Users.uat')
        .then((user) => {
          auAcFuncMemberName = user.auAcFuncMember.familyName + ' ' + user.auAcFuncMember.givenName
          au2FaActivityLogName =
            user.au2FaActivityLog.givenName + ' ' + user.au2FaActivityLog.familyName
        })
    })

    it('Cw Normal User sign then sign out then logs activity - Security', () => {
      Story.ticket('QA-1396')
      context('Sign in and out', () => {
        AccountUserStub.signInAsAuAcFuncMember()
        cy.signOutViaUserAvatar()
      })

      context('Navigate to security category activity log', () => {
        AccountUserStub.signInAsAuAcFuncMember()
        activityLogs.accessActivityLog()
        activityLogs.clickFilterActivityBy(SECURITY)
      })

      context('Verify signIn and signOut activity log', () => {
        activityLogs.containLogSignInToCw(auAcFuncMemberName, activityLogs.getCurrentDate())
        activityLogs.containLogSignOutFromCw(auAcFuncMemberName, activityLogs.getCurrentDate())
      })
    })
  })
})
