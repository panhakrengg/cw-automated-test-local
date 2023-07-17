import ManageCommunity from '../../../../classes/cop/ManageCommunity'
import Epic from '../../../../classes/Epic'
import GlobalMenu from '../../../../classes/global-menu/GlobalMenu'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.OrgAdmin, () => {
  let copName
  let copUrl
  const orgManageCommunity = new OrgManageCommunity()
  const manageCop = new ManageCommunity()
  const globalMenu = new GlobalMenu()

  context(Story.manageCommunities, () => {
    before(() => {
      new YamlHelper('communities')
        .read()
        .its('CreateCommunities.auCssEssential')
        .then((community) => {
          copName = community.name
          copUrl = community.url
        })
    })

    it('Org Admin create Training CoP and member can search', () => {
      Story.ticket('QA-457')
      context('Prepare data', () => {
        cy.logInTestCase('Prepare data')
        SignInAs.orgAdmin()
        manageCop.deleteByUrl(copUrl)
      })

      context('Create new community', () => {
        cy.logInTestCase('Create new community')
        orgManageCommunity.accessToManageCommunity()
        orgManageCommunity.createNewCommunity('Training', copName)
        orgManageCommunity.goBackToManageCommunities()
      })

      context('Verify community', () => {
        cy.logInTestCase('Verify community')
        SignInAs.reSignInAsOrgMember()
        globalMenu.visitCommunities()
        globalMenu.search(`'${copName}'`)
        globalMenu.waitSearchCommunity()
        globalMenu.expectVisible(copName)
      })

      context('Reset data', () => {
        cy.logInTestCase('Reset data')
        SignInAs.orgAdmin()
        manageCop.deleteByUrl(copUrl)
      })
    })
  })
})
