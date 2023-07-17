import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Admin from '../../../../classes/cop/Admin'
import CommunityAdmin from '../../../../classes/cop/CommunityAdmin'
import CommunityHome from '../../../../classes/cop/CommunityHome'
import { InterceptActionRequest } from '../../../../classes/cop/cop-administration/admin/base-admin/InterceptActionRequest'
import { ManageMembers } from '../../../../classes/cop/cop-administration/admin/manage-members/ManageMembers'
import { MemberRequests } from '../../../../classes/cop/cop-administration/admin/member-requests/MemberRequests'
import Epic from '../../../../classes/Epic'
import WebNotification from '../../../../classes/notification/WebNotification'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

const COMMUNITIES = ActivityCategories.COMMUNITIES

describe(Epic.Account, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const accountYamlHelper = new YamlHelper('account')
  const activityLogs = new ActivityLogs()
  const webNotification = new WebNotification()
  const communityHome = new CommunityHome()
  const manageMembers = new ManageMembers()
  const memberRequests = new MemberRequests()
  const admin = new Admin()

  context(Story.activityCommunities, () => {
    let auLogAcceptCopMemberName
    let auLogAcceptCopMemberEmail
    let auAcFuncName
    let oCopEnableAndDisableConsent

    before(() => {
      yamlHelper
        .read()
        .its('Users.uat')
        .then((user) => {
          const auLogAcceptCopMember = user.auLogAcceptCop
          auLogAcceptCopMemberName =
            auLogAcceptCopMember.givenName + ' ' + auLogAcceptCopMember.familyName
          auLogAcceptCopMemberEmail = auLogAcceptCopMember.email
          const auAcFunc = user.auAcFunc
          auAcFuncName = auAcFunc.familyName + ' ' + auAcFunc.givenName
        })
      accountYamlHelper
        .read()
        .its('Organizations.webLearn.communities')
        .then((communities) => {
          oCopEnableAndDisableConsent = communities.oCopEnableAndDisableConsent.name
        })
    })

    after(() => {
      ReportDefect.markAsUATCwDefect('Data broken because of node issue')
    })

    it('CoP Owner accept request to join CoP then logs activity - Communities', () => {
      const communityAdmin = new CommunityAdmin(oCopEnableAndDisableConsent)
      Story.ticket('QA-1415')

      context('Reset data', () => {
        cy.logInTestCase('Reset data')
        AccountUserStub.signInAsAuLogAcceptCop(`/web/${oCopEnableAndDisableConsent}`)
        cy.get('#main-content').then(($mainContent) => {
          if ($mainContent.find('h1:contains("Your request to join")').length) {
            AccountUserStub.signInAsAuAcFunc()
            webNotification.denyToJoinCommunity(
              auLogAcceptCopMemberName,
              oCopEnableAndDisableConsent
            )
          } else {
            InterceptActionRequest.itcAdminFetchManageMember.set()
            AccountUserStub.signInAsAuAcFunc(`/web/${oCopEnableAndDisableConsent}/admin/admin`)
            InterceptActionRequest.itcAdminFetchManageMember.wait()
            manageMembers.removeMemberIfExistWith(auLogAcceptCopMemberEmail)
            manageMembers.accessMemberRequestPage()
            memberRequests.removeMemberRequestsIfExistWith(auLogAcceptCopMemberEmail)
          }
        })
      })

      context(`Request to join community ${oCopEnableAndDisableConsent}`, () => {
        cy.logInTestCase(`Request to join community ${oCopEnableAndDisableConsent}`)
        AccountUserStub.signInAsAuLogAcceptCop(`/web/${oCopEnableAndDisableConsent}`)
        communityHome.clickButtonRequestToJoinCommunity()
        communityHome.submitRequestToJoinCommunity()
      })

      context('Accept invitation to join cop', () => {
        cy.logInTestCase('Accept invitation to join cop')
        AccountUserStub.signInAsAuAcFunc()
        communityAdmin.goToAdminTabWith(
          'manage-member-requests',
          communityAdmin._itcAdminFetchManageMember
        )
        communityAdmin.approveRequestAccess(auLogAcceptCopMemberEmail)
      })

      context('Verify accepted request to join community log', () => {
        cy.logInTestCase('Verify accepted request to join community log')
        activityLogs.accessActivityLog()
        activityLogs.clickFilterActivityBy(COMMUNITIES)
        activityLogs.containLogAcceptAccessRequestToJoinCop(
          auAcFuncName,
          auLogAcceptCopMemberName,
          oCopEnableAndDisableConsent,
          activityLogs.getCurrentDate()
        )
      })
    })
  })

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

    after(() => {
      ReportDefect.markAsUATCwDefect('Data broken because of node issue')
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
