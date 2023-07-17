import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpProfile from '../../../../../classes/my-profile/setup-data/SetUpProfile'
import SetupNewOrgMember from '../../../../../classes/org-management/setup-data/SetupNewOrgMember'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPAdministration, () => {
  const setUpProfile = new SetUpProfile()
  const setupNewOrgMember = new SetupNewOrgMember()
  const platform = 'Platform'

  let userObj
  before(() => {
    cy.stubUser(UserRole.ORG_MEMBER.EXIT_SIMO)
    cy.get('@stubUser').then((user) => {
      userObj = user
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Create new exited org member "Simo"', () => {
      context('invite > register', () => {
        setupNewOrgMember.fullProcessAddNewOrgMember(userObj)
      })
      context('Upload profile', () => {
        setUpProfile.login.asExitedSimo()
        setUpProfile.changeProfileImage(userObj.profile)
        setUpProfile.clickEditThenChangeNameVisibility(platform, platform)
      })
      context('Remove user from org', () => {
        setupNewOrgMember.fullProcessRemoveOrgMember(userObj)
      })
    })
  })
})
