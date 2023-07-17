import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Admin from '../../../../classes/cop/Admin'
import CommunityAdmin from '../../../../classes/cop/CommunityAdmin'
import Epic from '../../../../classes/Epic'
import WebNotification from '../../../../classes/notification/WebNotification'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

const COMMUNITIES = ActivityCategories.COMMUNITIES

describe(Epic.Account, { retries: 1 }, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const accountYamlHelper = new YamlHelper('account')
  const admin = new Admin()
  const activityLogs = new ActivityLogs()
  const webNotification = new WebNotification()

  context(Story.activityCommunities, () => {
    let auAcFuncMemberName
    let auAcFuncMemberEmail
    let auAcOrgAdminName
    let tpCopConsentActivity

    before(() => {
      yamlHelper
        .read()
        .its('Users.uat')
        .then((user) => {
          const auAcFuncMember = user.auAcFuncMember
          auAcFuncMemberName = auAcFuncMember.familyName + ' ' + auAcFuncMember.givenName
          auAcFuncMemberEmail = auAcFuncMember.email
          const auAcOrgAdmin = user.auAcOrgAdmin
          auAcOrgAdminName = auAcOrgAdmin.givenName + ' ' + auAcOrgAdmin.familyName
        })
      accountYamlHelper
        .read()
        .its('Organizations.webLearn.communities')
        .then((communities) => {
          tpCopConsentActivity = communities.tpCopConsentActivity.name
        })
    })

    it('CoP Owner able to see remove member then logs activity - Communities', () => {
      Story.ticket('QA-1416')
      const communityAdmin = new CommunityAdmin(tpCopConsentActivity)
      let isMember

      cy.logInTestCase('Reset data')
      AccountUserStub.signInAsAuAcOrgAdmin()
      communityAdmin.goToAdminManageMemberOfNonOrgCop()
      cy.cwTable().then(($table) => {
        isMember = $table.find(`span:contains(${auAcFuncMemberEmail})`).length
        if (!isMember) {
          admin.sendInviteEmails([auAcFuncMemberEmail])
          AccountUserStub.signInAsAuAcFuncMember()
          webNotification.acceptRequest('invited you to join')
        }
      })

      cy.logInTestCase('Remove member for community')
      if (!isMember) {
        AccountUserStub.signInAsAuAcOrgAdmin()
        communityAdmin.goToAdminManageMemberOfNonOrgCop()
      }
      communityAdmin.removeCopMember(auAcFuncMemberEmail)

      cy.logInTestCase('Verify remove member from community log')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(COMMUNITIES)
      activityLogs.containLogRemoveMemberFromCop(
        auAcOrgAdminName,
        auAcFuncMemberName,
        tpCopConsentActivity,
        activityLogs.getCurrentDate()
      )
    })
  })

  context(Story.activityCommunities, () => {
    let auMozellLuettgenName
    let auMozellLuettgenEmail
    let auAcOrgAdminName
    let tCopConsentActivity

    before(() => {
      new YamlHelper('users-orgmgt')
        .read()
        .its('Users.uat')
        .then((user) => {
          const auAcOrgAdmin = user.auAcOrgAdmin
          auAcOrgAdminName = auAcOrgAdmin.givenName + ' ' + auAcOrgAdmin.familyName
        })
      new YamlHelper('users')
        .read()
        .its('Users.uat')
        .then((user) => {
          const auMozellLuettgen = user.auMozellLuettgen
          auMozellLuettgenName = auMozellLuettgen.givenName + ' ' + auMozellLuettgen.familyName
          auMozellLuettgenEmail = auMozellLuettgen.email
        })
      new YamlHelper('account')
        .read()
        .its('Organizations.webLearn.communities')
        .then((communities) => {
          tCopConsentActivity = communities.tCopConsentActivity.name
        })
    })

    it('CoP Owner change community role then logs activity - Communities', () => {
      Story.ticket('QA-1417')
      const communityAdmin = new CommunityAdmin(tCopConsentActivity)
      cy.logInTestCase('Login as cop owner')
      AccountUserStub.signInAsAuAcOrgAdmin()
      communityAdmin.goToAdminManageMember()

      cy.logInTestCase(`Change member ${auMozellLuettgenName}'s role`)
      communityAdmin.getCurrentRole(auMozellLuettgenEmail).then(($role) => {
        communityAdmin.changeMemberRole(
          auMozellLuettgenEmail,
          'Change Role',
          $role.trim() === 'Administrator' ? 'Member' : 'Administrator'
        )
      })

      cy.logInTestCase('Verify change member role community log')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(COMMUNITIES)
      activityLogs.containLogChangeMemberRole(
        auAcOrgAdminName,
        auMozellLuettgenName,
        tCopConsentActivity,
        activityLogs.getCurrentDate()
      )
    })
  })
})
