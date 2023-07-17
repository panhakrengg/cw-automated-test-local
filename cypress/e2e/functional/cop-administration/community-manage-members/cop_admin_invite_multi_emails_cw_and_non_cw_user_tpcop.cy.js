import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CopAdministrationBase from '../../../../classes/cop/cop-administration/base/CopAdministrationBase'
import ManageMemberAction from '../../../../classes/cop/cop-administration/community-manage-member/actions/ManageMemberAction'
import ManageMemberAssertion from '../../../../classes/cop/cop-administration/community-manage-member/assertions/ManageMemberAssertion'

describe(Epic.CoPAdministration, () => {
  const copAdministrationBase = new CopAdministrationBase()
  const manageMemberAction = new ManageMemberAction()
  const manageMemberAssertion = new ManageMemberAssertion()

  context(Story.communityManageMembers, () => {
    let emails
    let cop
    let userFrances
    let userEnola
    let userMurl

    before(() => {
      copAdministrationBase.copManageMembersYaml.getUserInfoOrgUserFrances((user) => {
        userFrances = user
      })
      copAdministrationBase.copManageMembersYaml.getUserInfoOrgUserEnola((user) => {
        userEnola = user
      })
      copAdministrationBase.copManageMembersYaml.getUserInfoOrgUserMurl((user) => {
        userMurl = user
      })
      copAdministrationBase.copManageMembersYaml.getTPCoPInvite((data) => {
        cop = data
        emails = cop.invite.uat.viaMultiEmails
        copAdministrationBase.login.setCop(cop)
      })
    })

    it('CoP Admin invite multi emails (cw and non-cw users) - TPCoP', () => {
      Story.ticket('QA-666')

      copAdministrationBase.login.toCopManageMemberAsCopAdminBettye()

      cy.logInTestCase('Reset Data: Remove Users Form Cop')
      manageMemberAction.removeMultiMemberIfExistWith(emails)

      cy.logInTestCase('Invite Users Via Emails To Join Cop')
      manageMemberAction.inviteUserToJoinCopViaEmail(emails, cop.personalNote)
      cy.selectItemPerPage()

      cy.logInTestCase('Verify CW Users Display In Table')
      manageMemberAssertion.expectToSeeInvitedUserInTable(userFrances)
      manageMemberAssertion.expectToSeeInvitedUserInTable(userEnola)
      manageMemberAssertion.expectToSeeInvitedUserInTable(userMurl)

      cy.logInTestCase('Verify Non CW Users Display In Table')
      manageMemberAssertion.expectToSeeMultipleInvitedNonCwUsersInTable(emails)
    })
  })
})
