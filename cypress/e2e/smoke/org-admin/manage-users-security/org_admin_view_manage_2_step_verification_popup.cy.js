import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Environment from '../../../../classes/base/Environment'
import ManageUser from '../../../../classes/org-management/ManageUser'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, () => {
  const manageUser = new ManageUser()
  const env = new Environment()
  const yamlHelper = new YamlHelper('users-orgmgt')
  let screenName
  let orgInfo

  before(() => {
    cy.readFile('cypress/fixtures/org-structure/org-info.yaml').then((orgInfoString) => {
      orgInfo = YAML.parse(orgInfoString)
    })
    yamlHelper
      .read()
      .its(UserRole.ROOT_ORG_UNIT.TEAM_LEADERS)
      .then((userInfo) => {
        screenName = userInfo.users[env.getEnvYaml()].screenNames[0]
      })
  })

  beforeEach(() => {
    manageUser.setItc()
    manageUser.signInAsOrgAdmin()
    manageUser.waitItc()
    manageUser.searchMemberByName(screenName)
  })

  context(Story.manageUsersMemberSecurity, () => {
    it('Org Admin view Manage 2-Step Verification popup on member', () => {
      Story.ticket('QA-420')
      manageUser.showMemberTableFirstRowOnAction('Manage 2-Step Verification (2SV)')
      cy.get('.swal2-container').within(($popup) => {
        cy.wrap($popup).should('be.visible')
        cy.wrap($popup).get('.swal2-header > button').click()
      })
    })
  })
})
