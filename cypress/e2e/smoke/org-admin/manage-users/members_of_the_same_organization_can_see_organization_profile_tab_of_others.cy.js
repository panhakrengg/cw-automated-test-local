const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import OrgProfile from '../../../../classes/org-management/org-admin/OrgProfile'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsersOrganizationMemberProfile, () => {
    const orgProfile = new OrgProfile()
    let twoFaRootOrg, twoFaPlan

    before(() => {
      cy.readFile('cypress/fixtures/validation/org-profile.yaml').then((orgProfileString) => {
        const { orgProfile } = YAML.parse(orgProfileString)
        twoFaRootOrg = orgProfile['twoFaRootOrg']
        twoFaPlan = orgProfile['twoFaPlan']
      })
    })

    it('Members of the same Organization can see Organization Profile tab of others', () => {
      Story.ticket('QA-386')
      cy.logInTestCase('Root org member view profile from the same org unit')
      orgProfile.verifyRootOrgMemberCanSeeOtherOrgProfiletab(twoFaRootOrg)

      cy.logInTestCase('Root org member view organization profile from different org unit')
      orgProfile.verifyRootOrgMemberCanSeeOtherOrgProfiletab(twoFaPlan)
    })
  })
})
