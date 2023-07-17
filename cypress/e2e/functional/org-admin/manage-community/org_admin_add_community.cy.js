import ManageCommunity from '../../../../classes/cop/ManageCommunity'
import Epic from '../../../../classes/Epic'
import GlobalMenu from '../../../../classes/global-menu/GlobalMenu'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  let copName
  let copUrl
  const orgManageCommunity = new OrgManageCommunity()
  const manageCop = new ManageCommunity()
  const globalMenu = new GlobalMenu()

  context(Story.manageCommunities, () => {
    beforeEach(() => {
      new YamlHelper('communities')
        .read()
        .its('CreateCommunities.auCWTCoP')
        .then((community) => {
          copName = community.name
          copUrl = community.url
          manageCop.setCommunityName(copName)
        })
    })
    it('Org Admin Add Community', () => {
      Story.ticket('QA-459')
      SignInAs.orgAdmin()

      cy.logInTestCase('Reset data: Delete community')
      manageCop.deleteByUrl(copUrl)

      cy.logInTestCase('Precondition: Create community')
      manageCop.create('Training')
      cy.wait(30000)

      cy.logInTestCase('Add community')
      orgManageCommunity.accessToManageCommunity()
      orgManageCommunity.addCommunity(copName)

      cy.logInTestCase('Verify after adding')
      orgManageCommunity.searchCommunity(copName)
      orgManageCommunity.expectNewCommunityWithNoOrgUnit(copName)

      cy.logInTestCase('Org member can search new community')
      SignInAs.reSignInAsOrgMember()
      globalMenu.visitCommunities()
      globalMenu.search(copName)
      globalMenu.waitSearchCommunity()
      globalMenu.expectVisible(copName)

      cy.logInTestCase('Reset data: Delete community')
      SignInAs.orgAdmin()
      manageCop.deleteByUrl(copUrl)
    })
  })
})
