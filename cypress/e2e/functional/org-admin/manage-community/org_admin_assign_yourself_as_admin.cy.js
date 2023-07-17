import Environment from '../../../../classes/base/Environment'
import ManageCommunity from '../../../../classes/cop/ManageCommunity'
import Epic from '../../../../classes/Epic'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, { retries: 2 }, () => {
  let orgCopName
  let orgCopUrl
  let trainingCopName
  let trainingCopUrl
  const orgManageCommunity = new OrgManageCommunity()
  const manageCop = new ManageCommunity()
  const env = new Environment()
  before(() => {
    cy.readFile('cypress/fixtures/communities.yaml').then((communitiesString) => {
      const communities = YAML.parse(communitiesString).ManageCommunitySuite.nonOrg
      const orgCop = communities.webDevelopmentConcept
      const trainingCop = communities.mobileDevelopmentConcept
      orgCopName = orgCop.label
      orgCopUrl = orgCop.url[env.getEnvPrefix()]
      trainingCopName = trainingCop.label
      trainingCopUrl = trainingCop.url
    })
  })

  context(Story.manageCommunities, () => {
    it('Org Admin Assign yourself as admin', () => {
      Story.ticket('QA-452')
      context('Assign yourself as admin', () => {
        orgManageCommunity.singInByOrgAdmin()
        orgManageCommunity.assignYourselfAsAdmin(orgCopName)
        orgManageCommunity.assignYourselfAsAdmin(trainingCopName)
      })

      context('Verify navigation for org community', () => {
        manageCop.visitHome(orgCopUrl)
        orgManageCommunity.expectNavigationTabOfOrgCopAdmin()
      })

      context('Verify navigation for training community', () => {
        manageCop.visitHome(trainingCopUrl)
        orgManageCommunity.expectNavigationTabOfTrainingCopAdmin()
      })

      context('Unassign yourself from admin', () => {
        orgManageCommunity.accessToManageCommunity()
        cy.wait(15000)
        orgManageCommunity.unassignYourselfAsAdmin(orgCopName)
        orgManageCommunity.unassignYourselfAsAdmin(trainingCopName)
      })
    })
  })
})
