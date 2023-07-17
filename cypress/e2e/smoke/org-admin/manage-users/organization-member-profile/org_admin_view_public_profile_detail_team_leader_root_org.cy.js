import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import Environment from '../../../../../classes/base/Environment'
import SpyOpenWindowEvent from '../../../../../classes/base/SpyOpenWindowEvent'
import ManageUser from '../../../../../classes/org-management/ManageUser'
import ManageMembers from '../../../../../classes/org-management/org-structure/ManageMembers'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, () => {
  const manageUser = new ManageUser()
  const spyOpenWindowEvent = new SpyOpenWindowEvent()
  const manageMembers = new ManageMembers()
  const yamlHelper = new YamlHelper('users-orgmgt')
  const env = new Environment()

  let screenName
  let email
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
        email = userInfo.users[env.getEnvYaml()].emails[0]
      })
  })

  beforeEach(() => {
    manageUser.setItc()
    manageUser.signInAsOrgAdmin()
    manageUser.waitItc()
    manageUser.searchMemberByName(screenName)
  })

  context(Story.manageUsersOrganizationMemberProfile, () => {
    it('Org Admin view public profile detail team leader root org', () => {
      Story.ticket('334')
      manageUser.getRowData(email)
      manageMembers.viewPopupOrgProfile(screenName)
      spyOpenWindowEvent.setSpy()
      manageMembers.clickLinkViewPublicProfile()
      manageMembers.redirectToPublicProfile()
      manageMembers.expectedUserInRootOrg(orgInfo)
    })
  })
})
