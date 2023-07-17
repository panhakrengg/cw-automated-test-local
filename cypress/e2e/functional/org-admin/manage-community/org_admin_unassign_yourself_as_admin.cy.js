import ManageCommunity from '../../../../classes/cop/ManageCommunity'
import Epic from '../../../../classes/Epic'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  let orgCopName
  let orgCopUrl
  let trainingCopName
  let trainingCopUrl
  const orgManageCommunity = new OrgManageCommunity()
  const manageCop = new ManageCommunity()

  before(() => {
    cy.readFile('cypress/fixtures/communities.yaml').then((communitiesString) => {
      const communities = YAML.parse(communitiesString).ManageCommunitySuite.nonOrg
      const orgCop = communities.androidDevelopmentConcept
      const trainingCop = communities.iosDevelopmentConcept
      orgCopName = orgCop.label
      orgCopUrl = orgCop.url
      trainingCopName = trainingCop.label
      trainingCopUrl = trainingCop.url
    })
  })

  const assignYourSelfAsAdmin = () => {
    orgManageCommunity.accessToManageCommunity()
    orgManageCommunity.assignYourselfAsAdmin(orgCopName)
    orgManageCommunity.assignYourselfAsAdmin(trainingCopName)
  }

  context(Story.manageCommunities, () => {
    it('Org Admin Unassign yourself as admin', () => {
      Story.ticket('QA-458')
      context('Assign As Admin', () => {
        assignYourSelfAsAdmin()
      })

      context('Unassign from admin', () => {
        orgManageCommunity.unassignYourselfAsAdmin(orgCopName)
        orgManageCommunity.unassignYourselfAsAdmin(trainingCopName)
      })

      context('Verify org cop', () => {
        manageCop.visitHome(orgCopUrl)
        orgManageCommunity.expectNavigationTabOfOrgCopMember()
      })

      context('Verify training cop', () => {
        manageCop.visitHome(trainingCopUrl)
        orgManageCommunity.expectNavigationTabOfTrainingCopMember()
      })

      context('Reset to Admin', () => {
        assignYourSelfAsAdmin()
      })
    })
  })
})
