import Epic from '../../../../classes/Epic'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.OrgAdmin, { retries: 2 }, () => {
  let copWebDevelopmentConcept
  let orgUnitDesignFrontend
  const orgManageCommunity = new OrgManageCommunity()

  context(Story.manageCommunities, () => {
    before(() => {
      new YamlHelper('communities').read().then(({ ManageCommunitySuite }) => {
        copWebDevelopmentConcept = ManageCommunitySuite.nonOrg.webDevelopmentConcept.label
        orgUnitDesignFrontend = ManageCommunitySuite.subOrg.designFrontend.label
      })
      cy.intercept('**manage_communities%2Fget_org_units').as('getOrgUnits')
      cy.intercept('**manage_communities%2Fsearch').as('getCommunities')
    })

    function resetData(copName) {
      orgManageCommunity.increaseShowCommunity()
      cy.get(`table tr:contains(${copName})`).within(($row) => {
        cy.wrap($row).as('copRow')
        cy.wrap($row)
          .get('td:nth-child(2)')
          .invoke('text')
          .then(($text) => {
            cy.wrap($text.trim()).as('currentOrgUnit')
          })
      })
      cy.get('@currentOrgUnit').then(($orgUnit) => {
        if ($orgUnit == orgUnitDesignFrontend) {
          cy.get('@copRow').within(() => {
            orgManageCommunity.clickThreeDotEditOrgUnit()
          })
          orgManageCommunity.searchOrgUnitBy()
          orgManageCommunity.saveOrgUnitBy()
        }
      })
    }
    it('Org Admin unassigned org unit from a CoP to NONE', () => {
      Story.ticket('QA-453')
      orgManageCommunity.singInByOrgAdmin()
      cy.logInTestCase('Reset data')
      resetData(copWebDevelopmentConcept)

      cy.logInTestCase('Edit org unit')
      orgManageCommunity.editOrganizationUnit(copWebDevelopmentConcept)
      orgManageCommunity.searchOrgUnitBy(orgUnitDesignFrontend)
      orgManageCommunity.saveOrgUnitBy(orgUnitDesignFrontend)
      orgManageCommunity.searchCommunity(copWebDevelopmentConcept)
      orgManageCommunity.checkOrgUnitForCoP(copWebDevelopmentConcept, orgUnitDesignFrontend)
      orgManageCommunity.verifyCopListedUnderNewOrgUnit(
        copWebDevelopmentConcept,
        orgUnitDesignFrontend
      )

      cy.logInTestCase('UnAssign org unit from the community')
      orgManageCommunity.singInByOrgAdmin()
      orgManageCommunity.editOrganizationUnit(copWebDevelopmentConcept)
      orgManageCommunity.searchOrgUnitBy()
      orgManageCommunity.saveOrgUnitBy()
      orgManageCommunity.searchCommunity(copWebDevelopmentConcept)
      orgManageCommunity.checkOrgUnitForCoP(copWebDevelopmentConcept)
      orgManageCommunity.verifyCopRemovedFromOrgUnit(
        copWebDevelopmentConcept,
        orgUnitDesignFrontend
      )
    })
  })
})
