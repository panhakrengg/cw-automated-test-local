import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupNewOrgMember from '../../../../../classes/org-management/setup-data/SetupNewOrgMember'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  let user
  before(() => {
    cy.stubUser(UserRole.ORG_MEMBER.EXIT_HAZLE).then((data) => {
      user = data
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Remove "aue_exited_hazle" to FireCloud Zone org', () => {
      new SetupNewOrgMember().fullProcessRemoveOrgMember(user)
    })
  })
})
