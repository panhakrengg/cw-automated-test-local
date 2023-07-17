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
  const webNotification = new WebNotification()

  context(Story.communityManageMembers, { retries: 1 }, () => {
    let cwUser
    let cop
    let copName
    let personalNote
    before(() => {
      copAdministrationBase.copManageMembersYaml.getUserInfoCwNormalUser((data) => {
        cwUser = data
      })
      copAdministrationBase.copManageMembersYaml.getOCoPInvite((data) => {
        cop = data
        copName = cop.name.value
        personalNote = data.personalNote
        copAdministrationBase.login.setCop(cop)
      })
    })

    it('CoP Admin invite cw user via email then user click request notification - OCoP', () => {
      Story.ticket('QA-1205')

      copAdministrationBase.login.toCopManageMemberAsCopAdminBettye()

      cy.logInTestCase('Reset Data: Remove User Form Cop')
      manageMemberAction.removeMemberIfExistWith(cwUser.email)

      cy.logInTestCase('Invite User To Join Cop')
      manageMemberAction.inviteUserToJoinCopViaEmail(cop.invite.uat.viaCwUserEmail, personalNote)

      cy.logInTestCase('Verify Connection Users Are Invited Successfully')
      manageMemberAssertion.expectToSeeInvitedUserInTable(cwUser)

      cy.logInTestCase('Verify Users Received Email Notification')
      manageMemberAssertion.verifyInvitationEmailTemplate(cwUser, cop, false)

      cy.logInTestCase('Login As Invited User And Click Invitation Notification')
      SignInAs.cwNormalUser()
      webNotification.containNotificationRequest(`invited you to join ${copName}.`)
      webNotification.getNotificationBy(`invited you to join ${copName}.`).click()

      cy.logInTestCase('Verify User Must See Not Available Page')
      cy.thisLinkIsNotAvailable()
    })
  })
})
