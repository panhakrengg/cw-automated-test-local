import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageCommunity from '../../../../classes/cop/ManageCommunity'
import CourseCommunityCreation from '../../../../classes/org-management/org-structure/CourseCommunityCreation'
import OrgUnitInfo from '../../../../classes/org-management/org-structure/OrgUnitInfo'

describe(Epic.OrgStructure, () => {
  let orgUnitName, copName
  const courseCommunityCreation = new CourseCommunityCreation()
  const manageCommunity = new ManageCommunity()
  const orgUnitInfo = new OrgUnitInfo()
  before(() => {
    cy.readFile('cypress/fixtures/community-course-creation.yaml').then((response) => {
      const subOrgUnit =
        YAML.parse(response).EnableDisableCommunityCourseCreation.organizationStructure
          .webLearnInternational.subOrgUnit
      orgUnitName = subOrgUnit.existing.designFrontend.name
    })
    cy.readFile('cypress/fixtures/communities.yaml').then((communitiesString) => {
      const suiteTest = YAML.parse(communitiesString)
      copName =
        suiteTest.ManageCommunitySuite.subOrg.designFrontend.subOrg.instructionSession.communities
          .dataStrucureAndAlgorithm.label
      manageCommunity.setCommunityName(copName)
    })
  })

  context(Story.enableDisableCommunityCourseCreation, () => {
    beforeEach(() => {
      orgUnitInfo.login.asOrgAdmin()
    })
    it('CoP owner able to add existing courses to TCoP after the Org Admin disables course creation', () => {
      Story.ticket('QA-371')
      manageCommunity.goToAdminManageCourse()
      courseCommunityCreation.expectAddExistingCourseButton()
    })
  })
})
