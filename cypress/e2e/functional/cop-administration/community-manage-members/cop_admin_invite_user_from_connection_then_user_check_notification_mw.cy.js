import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CopAdministrationBase from '../../../../classes/cop/cop-administration/base/CopAdministrationBase'
import ManageMemberAction from '../../../../classes/cop/cop-administration/community-manage-member/actions/ManageMemberAction'
import HomeAssertion from '../../../../classes/cop/cop-administration/community-manage-member/assertions/HomeAssertion'
import ManageMemberAssertion from '../../../../classes/cop/cop-administration/community-manage-member/assertions/ManageMemberAssertion'
import WebNotification from '../../../../classes/notification/WebNotification'

describe(Epic.CoPAdministration, () => {
  const copAdministrationBase = new CopAdministrationBase()
  const manageMemberAction = new ManageMemberAction()
  const manageMemberAssertion = new ManageMemberAssertion()
  const homeAssertion = new HomeAssertion()

  context(Story.communityManageMembers, () => {
    let connectionUser
    let cop
    let personalNote
    before(() => {
      copAdministrationBase.copManageMembersYaml.getUserInfoAmanda((data) => {
        connectionUser = data
      })
      copAdministrationBase.copManageMembersYaml.getMwCoPInvite((data) => {
        cop = data
        personalNote = data.personalNote
        copAdministrationBase.login.setCop(cop)
      })
    })

    it('CoP Admin invite user from Connections then user check notification - MWCoP', () => {
      Story.ticket('QA-583')

      copAdministrationBase.login.toCopManageMemberAsCopAdminBettye()

      cy.logInTestCase('Reset Data: Remove User Form Cop')
      manageMemberAction.removeMemberIfExistWith(connectionUser.email)

      cy.logInTestCase('Invite User To Join Cop')
      manageMemberAction.inviteConnectionUserToJoinCop(cop.invite.uat.viaSelection[0], personalNote)

      cy.logInTestCase('Verify Connection User Is Invited successfully')
      manageMemberAssertion.expectToSeeInvitedUserInTable(connectionUser)

      cy.logInTestCase('Verify Receive Email Notification')
      manageMemberAssertion.verifyInvitationEmailTemplate(connectionUser, cop)

      cy.logInTestCase('Invite User Check Notification')
      copAdministrationBase.login.toCopHomeAsConnectionUserAmanda()

      cy.logInTestCase('Verify Connections User Receive Invitation')
      new WebNotification().containNotificationRequest(`invited you to join ${cop.name.value}.`)
      homeAssertion.expectToSeeButtonAcceptInvitation()
    })
  })
})
