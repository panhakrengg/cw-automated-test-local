const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import OrgProfile from '../../../../classes/org-management/org-admin/OrgProfile'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsersOrganizationMemberProfile, () => {
    const orgProfile = new OrgProfile()
    let memberFe

    before(() => {
      cy.readFile('cypress/fixtures/validation/org-profile.yaml').then((orgProfileString) => {
        memberFe = YAML.parse(orgProfileString)['orgProfile']['memberFe']
      })
    })

    beforeEach(() => orgProfile.goToMyProfile(UserRole.DESIGN_FRONTEND.MEMBERS))
    it('Turn off toggle on org profile', () => {
      Story.ticket('QA-387')
      orgProfile.verifyToggleOthersInMyOrganizationCanView(true)
      orgProfile.verifyOrgMemberCanSeeOrgProfileTab()
      orgProfile.verifyRootOrgMemberShouldNotSeeOtherOrgProfiletab(memberFe)
    })

    it('Turn on toggle on org profile', () => {
      Story.ticket('QA-478')
      orgProfile.verifyToggleOthersInMyOrganizationCanView()
      orgProfile.verifyRootOrgMemberCanSeeOtherOrgProfiletab(memberFe)
    })
  })
})
