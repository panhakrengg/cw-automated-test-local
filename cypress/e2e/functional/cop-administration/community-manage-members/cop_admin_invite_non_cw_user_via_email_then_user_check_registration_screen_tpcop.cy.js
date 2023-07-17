import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CopAdministrationBase from '../../../../classes/cop/cop-administration/base/CopAdministrationBase'
import ManageMemberAction from '../../../../classes/cop/cop-administration/community-manage-member/actions/ManageMemberAction'
import ManageMemberAssertion from '../../../../classes/cop/cop-administration/community-manage-member/assertions/ManageMemberAssertion'
import { NonCWUsersMock } from '../../../../classes/utilities/NonCWUsersMock'

describe(Epic.CoPAdministration, () => {
  const copAdministrationBase = new CopAdministrationBase()
  const manageMemberAction = new ManageMemberAction()
  const manageMemberAssertion = new ManageMemberAssertion()

  context(Story.communityManageMembers, () => {
    let nonCwUser
    let cop
    before(() => {
      new NonCWUsersMock().getNonCwUser06().then((data) => {
        nonCwUser = data
      })
      copAdministrationBase.copManageMembersYaml.getTPCoPInvite((data) => {
        cop = data
        copAdministrationBase.login.setCop(cop)
      })
    })

    it('CoP Admin invite non-cw user via email the user check registration screen- TPCoP', () => {
      Story.ticket('QA-663')

      copAdministrationBase.login.toCopManageMemberAsCopAdminBettye()

      cy.logInTestCase('Reset Data: Remove User Form Cop')
      manageMemberAction.removeMemberIfExistWith(nonCwUser.email)

      cy.logInTestCase('Invite User To Join Cop')
      manageMemberAction.inviteUserToJoinCopViaEmail(cop.invite.uat.viaNonCwEmail, cop.personalNote)

      cy.logInTestCase('Verify Connection Users Are Invited Successfully')
      manageMemberAssertion.expectToSeeInvitedNonCwUserInTable(nonCwUser)
      manageMemberAssertion.verifyInvitationEmailTemplateForNonCwUser(nonCwUser, cop)

      cy.logInTestCase('Verify Users Received Email Notification')
      manageMemberAction.signOutAndRedirectToCreateNewAccount()
      manageMemberAssertion.verifyRegistrationScreen(cop.name.value, nonCwUser.email)
    })
  })
})
