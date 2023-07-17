import UserRole from '../../../../classes/utilities/user-role/UserRole'

const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import OrgProfile from '../../../../classes/org-management/org-admin/OrgProfile'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsersOrganizationMemberProfile, () => {
    const orgProfile = new OrgProfile()
    const manageUsers = new ManageUsers()

    let viewOrgProfile, profileInfo

    const updateMemberProfile = (rollback) => {
      orgProfile.goToMyProfile(UserRole.ORG_MEMBER.VIEW_ORG_PROFILE)
      orgProfile.clickEditContactInfo()
      orgProfile.updateGivenNameAndFamilyName(rollback)
    }
    const adminVerifyUpdatedInfo = () => {
      cy.get('@failedPreviously').then((result) => {
        if (!result) {
          viewOrgProfile['screenName'] = `${viewOrgProfile['screenName']} (${
            viewOrgProfile['givenName'] + orgProfile._updated
          } ${viewOrgProfile['familyName'] + orgProfile._updated})`
        }
      })
      manageUsers.findUserRowByAdmin(viewOrgProfile['email'])
      manageUsers.verifyOrgNameColumn(viewOrgProfile)
      manageUsers.verifyPublicNameColumn(viewOrgProfile)
      manageUsers.openViewOrgProfilePopup()
      manageUsers.defineAliasOrgProfileInfoPopup()
      manageUsers.defineAliasesForPersonalInfo()
      manageUsers.validateProfileInfo(profileInfo)
      manageUsers.defineAliasOrgProfileInfoPopup(4, 'publicProfileDetails')
      manageUsers.verifyPublicProfileDetails(viewOrgProfile['screenName'], viewOrgProfile['email'])
    }

    before(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
        viewOrgProfile = YAML.parse(OrgMgtUsersString)['Users']['uat']['viewOrgProfile']
        profileInfo = {
          firstName: viewOrgProfile['givenName'],
          lastName: viewOrgProfile['familyName'],
          email: viewOrgProfile['email'],
        }
      })
    })

    it('Org Member update Public profile, there is nothing change on Org Profile', () => {
      Story.ticket('QA-476')
      updateMemberProfile()
      adminVerifyUpdatedInfo()
      updateMemberProfile(true)
    })
  })
})
