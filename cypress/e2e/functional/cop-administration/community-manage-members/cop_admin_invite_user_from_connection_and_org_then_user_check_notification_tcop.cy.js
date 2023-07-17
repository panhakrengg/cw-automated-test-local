import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CopAdministrationBase from '../../../../classes/cop/cop-administration/base/CopAdministrationBase'
import ManageMemberAction from '../../../../classes/cop/cop-administration/community-manage-member/actions/ManageMemberAction'
import HomeAssertion from '../../../../classes/cop/cop-administration/community-manage-member/assertions/HomeAssertion'
import ManageMemberAssertion from '../../../../classes/cop/cop-administration/community-manage-member/assertions/ManageMemberAssertion'
import WebNotification from '../../../../classes/notification/WebNotification'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.CoPAdministration, { retries: 1 }, () => {
  const copAdministrationBase = new CopAdministrationBase()
  const manageMemberAction = new ManageMemberAction()
  const manageMemberAssertion = new ManageMemberAssertion()
  const homeAssertion = new HomeAssertion()

  context(Story.communityManageMembers, () => {
    let connectionUser
    let orgMember
    let cop
    let copName
    let personalNote
    before(() => {
      copAdministrationBase.copManageMembersYaml.getUserInfoJamison((data) => {
        connectionUser = data
      })
      copAdministrationBase.copManageMembersYaml.getUserInfoArielle((data) => {
        orgMember = data
      })
      copAdministrationBase.copManageMembersYaml.getTCoPInvite((data) => {
        cop = data
        copName = cop.name.value
        personalNote = data.personalNote
        copAdministrationBase.login.setCop(cop)
      })
    })

    it('CoP Admin invite user from Connections and organization then users check notification - TCoP', () => {
      Story.ticket('QA-658')

      copAdministrationBase.login.toCopManageMemberAsCopAdminBettye()

      cy.logInTestCase('Reset Data: Remove User Form Cop')
      manageMemberAction.removeMemberIfExistWith(connectionUser.email)
      manageMemberAction.removeMemberIfExistWith(orgMember.email)

      cy.logInTestCase('Invite User To Join Cop')
      manageMemberAction.inviteMultipleConnectionAndOrgUsersToJoinCop(
        cop.invite.uat.viaSelection,
        personalNote
      )

      cy.logInTestCase('Verify Connection Users Are Invited Successfully')
      manageMemberAssertion.expectToSeeInvitedUserInTable(connectionUser)
      manageMemberAssertion.expectToSeeInvitedUserInTable(orgMember)

      cy.logInTestCase('Verify Users Received Email Notification')
      manageMemberAssertion.verifyInvitationEmailTemplate(connectionUser, cop)
      manageMemberAssertion.verifyInvitationEmailTemplate(orgMember, cop)

      cy.logInTestCase('Login As Invited User And Verify Invitation Notification')
      SignInAs.myConnection_Jamison()
      new WebNotification().containNotificationRequest(`invited you to join ${copName}.`)

      cy.logInTestCase('Login As Invited User And Verify Invitation Notification')
      copAdministrationBase.login.toCopHomeAsOrgMemberArielle()
      new WebNotification().containNotificationRequest(`invited you to join ${copName}.`)
      homeAssertion.expectToSeeButtonAcceptInvitation()
    })
  })
})
