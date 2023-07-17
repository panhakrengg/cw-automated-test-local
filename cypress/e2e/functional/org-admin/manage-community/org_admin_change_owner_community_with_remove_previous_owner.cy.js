import Epic from '../../../../classes/Epic'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  let learningAdminEmail
  let auLearnMgtAdminScreenName
  let orgAdminGivenName
  let computerArchitecture
  const orgManageCommunity = new OrgManageCommunity()

  context(Story.manageCommunities, () => {
    before(() => {
      new YamlHelper('users-orgmgt')
        .read()
        .its('OrgMgtUsers.orgMgt.admins')
        .then((admins) => {
          const orgAdminUser = admins.organization.users.uat
          const learningAdminUser = admins.learning.users.uat
          orgAdminGivenName = orgAdminUser.givenNames[0]
          learningAdminEmail = learningAdminUser.emails[0]
          auLearnMgtAdminScreenName = learningAdminUser.screenNames[0]
        })

      new YamlHelper('communities')
        .read()
        .its(
          'ManageCommunitySuite.subOrg.designFrontend.subOrg.instructionSession.communities.computerArchitecture'
        )
        .then((data) => {
          computerArchitecture = data.label
        })
    })

    beforeEach(() => {
      orgManageCommunity.accessToManageCommunity()
    })

    it('Org Admin change owner assign organization from the search drop-down and remove previous owner"', () => {
      Story.ticket('QA-445')
      orgManageCommunity.resetUserOwner(
        computerArchitecture,
        orgAdminGivenName,
        auLearnMgtAdminScreenName
      )
      orgManageCommunity.changeOwnerAndVerify(
        computerArchitecture,
        auLearnMgtAdminScreenName,
        true,
        learningAdminEmail
      )
      orgManageCommunity.revertPreviousOwner(computerArchitecture, orgAdminGivenName)
    })
  })
})
