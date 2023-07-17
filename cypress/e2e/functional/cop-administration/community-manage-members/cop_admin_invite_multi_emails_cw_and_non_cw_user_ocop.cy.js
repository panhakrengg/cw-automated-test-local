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
    let userEmery
    let userTressie
    let userJoanie

    before(() => {
      copAdministrationBase.copManageMembersYaml.getUserInfoOrgUserEmery((user) => {
        userEmery = user
      })
      copAdministrationBase.copManageMembersYaml.getUserInfoOrgUserTressie((user) => {
        userTressie = user
      })
      copAdministrationBase.copManageMembersYaml.getUserInfoOrgUserJoanie((user) => {
        userJoanie = user
      })
      copAdministrationBase.copManageMembersYaml.getOCoPInvite((data) => {
        cop = data
        emails = cop.invite.uat.viaMultiEmails
        copAdministrationBase.login.setCop(cop)
      })
    })

    it('CoP Admin invite multi emails (cw and non-cw users) - OCoP', () => {
      Story.ticket('QA-665')

      copAdministrationBase.login.toCopManageMemberAsCopAdminBettye()

      cy.logInTestCase('Reset Data: Remove Users Form Cop')
      manageMemberAction.removeMultiMemberIfExistWith(emails)

      cy.logInTestCase('Invite Users Via Emails To Join Cop')
      manageMemberAction.inviteUserToJoinCopViaEmail(emails, cop.personalNote)
      cy.selectItemPerPage()

      cy.logInTestCase('Verify CW Users Display In Table')
      manageMemberAssertion.expectToSeeInvitedUserInTable(userEmery)
      manageMemberAssertion.expectToSeeInvitedUserInTable(userTressie)
      manageMemberAssertion.expectToSeeInvitedUserInTable(userJoanie)

      cy.logInTestCase('Verify Non CW Users Display In Table')
      manageMemberAssertion.expectToSeeMultipleInvitedNonCwUsersInTable(emails)
    })
  })
})
