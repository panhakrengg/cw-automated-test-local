import ManageCommunity from '../../../../classes/cop/ManageCommunity'
import Epic from '../../../../classes/Epic'
import OrgUnitInfo from '../../../../classes/org-management/org-structure/OrgUnitInfo'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  let copName
  let copUrl
  let ownerEmail
  const orgManageCommunity = new OrgManageCommunity()
  const orgUnitInfo = new OrgUnitInfo()
  const manageCop = new ManageCommunity()

  before(() => {
    cy.readFile('cypress/fixtures/communities.yaml').then((communitiesString) => {
      const community = YAML.parse(communitiesString).CreateCommunities.auJavaScriptEssential
      copName = community.name
      copUrl = community.url
    })
    cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgUsersString) => {
      const orgUsers = YAML.parse(OrgUsersString).OrgMgtUsers
      const orgAdminUser = orgUsers.orgMgt.admins.organization.users.uat
      ownerEmail = orgAdminUser.emails[0]
    })
  })

  context(Story.manageCommunities, () => {
    it('Org Admin create Organization CoP show auto select organization name', () => {
      Story.ticket('QA-455')

      cy.logInTestCase('Prepare data')
      SignInAs.orgAdmin()
      manageCop.deleteByUrl(copUrl)

      cy.logInTestCase('Create new community')
      orgManageCommunity.accessToManageCommunity()
      orgManageCommunity.createNewCommunity('Organization', copName)
      cy.wait(20000) // it takes time for new community appearing
      orgManageCommunity.goBackToManageCommunities()

      cy.logInTestCase('Verify community')
      orgManageCommunity.searchCommunity(copName)
      orgManageCommunity.expectNewCommunityWithNoOrgUnit(copName)

      cy.logInTestCase('Verify owner')
      orgUnitInfo.checkCopOnMyCommunities(copName, copUrl)
      manageCop.visitManageMember(copUrl)
      manageCop.expectOwner(ownerEmail)

      cy.logInTestCase('Reset data')
      manageCop.deleteByUrl(copUrl)
    })
  })
})
