import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CopAdministrationBase from '../../../../classes/cop/cop-administration/base/CopAdministrationBase'
import ManageMemberAction from '../../../../classes/cop/cop-administration/community-manage-member/actions/ManageMemberAction'
import ManageMemberAssertion from '../../../../classes/cop/cop-administration/community-manage-member/assertions/ManageMemberAssertion'
import WebNotification from '../../../../classes/notification/WebNotification'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.CoPAdministration, () => {
  const copAdministrationBase = new CopAdministrationBase()
  const manageMemberAction = new ManageMemberAction()
  const manageMemberAssertion = new ManageMemberAssertion()

  context(Story.communityManageMembers, () => {
    let orgUser
    let cop
    let copName
    let personalNote
    before(() => {
      copAdministrationBase.copManageMembersYaml.getUserInfoOrgUserHazle((data) => {
        orgUser = data
      })
      copAdministrationBase.copManageMembersYaml.getTCoPInvite((data) => {
        cop = data
        copName = cop.name.value
        personalNote = data.personalNote
        copAdministrationBase.login.setCop(cop)
      })
    })

    it('CoP Admin invite cw user via email then user check notification - TCoP', () => {
      Story.ticket('QA-660')

      copAdministrationBase.login.toCopManageMemberAsCopAdminBettye()

      cy.logInTestCase('Reset Data: Remove User Form Cop')
      manageMemberAction.removeMemberIfExistWith(orgUser.email)

      cy.logInTestCase('Invite User To Join Cop')
      manageMemberAction.inviteUserToJoinCopViaEmail(cop.invite.uat.viaCwUserEmail, personalNote)

      cy.logInTestCase('Verify Connection Users Are Invited Successfully')
      manageMemberAssertion.expectToSeeInvitedUserInTable(orgUser)

      cy.logInTestCase('Verify Users Received Email Notification')
      manageMemberAssertion.verifyInvitationEmailTemplate(orgUser, cop, false)

      cy.logInTestCase('Login As Invited User And Verify Invitation Notification')
      SignInAs.reSignInAsExited_Hazle()
      new WebNotification().containNotificationRequest(`invited you to join ${copName}.`)
    })
  })
})
