import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Admin from '../../../../classes/cop/Admin'
import CommunityAdmin from '../../../../classes/cop/CommunityAdmin'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

const COMMUNITIES = ActivityCategories.COMMUNITIES

describe(Epic.Account, { retries: 1 }, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const accountYamlHelper = new YamlHelper('account')
  const admin = new Admin()
  const activityLogs = new ActivityLogs()

  context(Story.activityCommunities, () => {
    let auAcFuncMemberName
    let auAcFuncMemberEmail
    let auAcFuncName
    let tpCopInviteMember
    let isMember

    before(() => {
      yamlHelper
        .read()
        .its('Users.uat')
        .then((user) => {
          const auAcFuncMember = user.auAcFuncMember
          auAcFuncMemberName = auAcFuncMember.familyName + ' ' + auAcFuncMember.givenName
          auAcFuncMemberEmail = auAcFuncMember.email
          const auAcFunc = user.auAcFunc
          auAcFuncName = auAcFunc.familyName + ' ' + auAcFunc.givenName
        })
      accountYamlHelper
        .read()
        .its('Organizations.webLearn.communities')
        .then((communities) => {
          tpCopInviteMember = communities.tpCopInviteMember.name
        })
    })

    it('CoP Owner invite user to join CoP then logs activity - Communities', () => {
      Story.ticket('QA-1414')
      const communityAdmin = new CommunityAdmin(tpCopInviteMember)
      cy.logInTestCase('Reset data')
      AccountUserStub.signInAsAuAcFunc()
      communityAdmin.goToAdminManageMemberForNonOrgCop()
      cy.cwTable().then(($table) => {
        isMember = $table.find(`span:contains(${auAcFuncMemberEmail})`).length
        if (isMember) {
          communityAdmin.removeCopMember(auAcFuncMemberEmail)
        }
      })

      cy.logInTestCase('Invite user to community')
      admin.sendInviteEmails([auAcFuncMemberEmail])

      cy.logInTestCase('Verify invite user to community log')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(COMMUNITIES)
      activityLogs.containLogInviteMemberToJoinCop(
        auAcFuncName,
        auAcFuncMemberName,
        tpCopInviteMember,
        activityLogs.getCurrentDate()
      )
    })
  })
})
