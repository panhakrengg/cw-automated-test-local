import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import ManageUser from '../../../../classes/org-management/ManageUser'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const manageUser = new ManageUser()
  let orgMemberScreenNameEvan
  let orgMemberScreenNameCoffee
  let orgMemberGivenNameEvan

  context(Story.manageUsersMembersProfileEncryption, () => {
    before(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((userOrgMgString) => {
        const users = YAML.parse(userOrgMgString).Users[new Environment().getEnvYaml()]
        orgMemberScreenNameEvan = users.orgMemberEvan.screenName
        orgMemberScreenNameCoffee = users.orgMemberCoffeeSick.screenName
        orgMemberGivenNameEvan = users.orgMemberEvan.givenName
      })
    })

    beforeEach(() => {
      manageUser.setItc()
      manageUser.signInAsOrgAdmin()
      manageUser.waitItc()
    })
    it('Column Name (Public Profile) - Verify name display', () => {
      Story.ticket('QA-446')
      manageUser.expectedUserDisplayGivenName(orgMemberScreenNameEvan, orgMemberGivenNameEvan)
      manageUser.clearMemberSearchBox()
      manageUser.expectedUserNotDisplayGivenName(orgMemberScreenNameCoffee)
    })
  })
})
