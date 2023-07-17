import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import ManageCommunity from '../../../classes/cop/ManageCommunity'
import CourseCommunityCreation from '../../../classes/org-management/org-structure/CourseCommunityCreation'
import OrgUnitInfo from '../../../classes/org-management/org-structure/OrgUnitInfo'
import ReportDefect from '../../../classes/utilities/ReportDefect'

describe(Epic.OrgStructure, { retries: 1 }, () => {
  let copName, orgUnitName, copUrl
  const courseCommunityCreation = new CourseCommunityCreation()
  const manageCommunity = new ManageCommunity()
  const orgUnitInfo = new OrgUnitInfo()
  before(() => {
    cy.readFile('cypress/fixtures/community-course-creation.yaml').then((response) => {
      const subOrgUnit =
        YAML.parse(response).EnableDisableCommunityCourseCreation.organizationStructure
          .webLearnInternational.subOrgUnit
      const cop = subOrgUnit.existing.designFrontend.community
      copName = cop.name.new
      copUrl = cop.url
      orgUnitName = subOrgUnit.existing.designFrontend.name
      manageCommunity.setCommunityName(copName)
    })
  })

  context(Story.enableDisableCommunityCourseCreation, () => {
    it('Team Leader create 3rd Sub Org follow 2nd Sub Org disable course creation', () => {
      Story.ticket('QA-373')
      cy.logInTestCase('Reset data: remove cop if exist')
      orgUnitInfo.login.asTeamLeaderRootOrg()
      manageCommunity.deleteByUrl(copUrl)

      cy.logInTestCase('Create cop')
      orgUnitInfo.visitOrgStructure()
      courseCommunityCreation.accessToSubOrg(orgUnitName)
      courseCommunityCreation.createNewCommunity()
      manageCommunity.createByType('Training')

      cy.logInTestCase('Training Cop see “ADD EXISTING COURSE“')
      cy.wait(20000) // wait for button to visible
      manageCommunity.goToAdminManageCourse()
      courseCommunityCreation.expectAddExistingCourseButton()
      manageCommunity.deleteByUrl(copUrl)
    })
  })
})
