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
    let userFrances
    let nonCwUser
    let cop

    before(() => {
      copAdministrationBase.copManageMembersYaml.getUserInfoOrgUserFrances((data) => {
        userFrances = data
      })
      new NonCWUsersMock().getNonCwUser03().then((data) => {
        nonCwUser = data
      })
      copAdministrationBase.copManageMembersYaml.getMwCoPReminder((data) => {
        cop = data
        copAdministrationBase.login.setCop(cop)
      })
    })

    it('CoP Owner send reminder (cw and non-cw users ) then users check notification - MWCoP', () => {
      Story.ticket('QA-587')

      copAdministrationBase.login.toCopManageMemberAsCopOwnerPhoebe()

      cy.logInTestCase('Remind Cw Users To Join Cop')
      manageMemberAction.sendReminderToJoinCop(cop.reminder.uat.viaCwUserEmail[0], cop.personalNote)

      cy.logInTestCase('Verify Cw User Received Reminder Email Notification')
      manageMemberAssertion.verifyReminderInvitationEmailTemplate(userFrances, cop, false)

      cy.logInTestCase('Remind Non Cw Users To Join Cop')
      manageMemberAction.sendReminderToJoinCop(cop.reminder.uat.viaNonCwEmail[0], cop.personalNote)

      cy.logInTestCase('Verify Non Cw User Received Reminder Email Notification')
      manageMemberAssertion.verifyReminderInvitationEmailTemplate(nonCwUser, cop, false, true)
    })
  })
})
