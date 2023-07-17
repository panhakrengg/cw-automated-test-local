import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupNewOrgMember from '../../../../../classes/org-management/setup-data/SetupNewOrgMember'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  let user
  before(() => {
    cy.stubUser(UserRole.ORG_MEMBER.EXIT_HAZLE).then((data) => {
      user = data
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Invite "aue_exited_hazle" to FireCloud Zone org', () => {
      SignInAs.orgAdmin_Amy()

      new SetupNewOrgMember().fullProcessAddCwUserToOrg(user)
    })
  })
})
