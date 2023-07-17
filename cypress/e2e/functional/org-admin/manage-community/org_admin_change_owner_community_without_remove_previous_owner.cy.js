import Epic from '../../../../classes/Epic'
import OrgManageCommunity from '../../../../classes/org-management/OrgManageCommunity'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  let learningAdminEmail
  let auLearnMgtAdminScreenName
  let orgAdminGivenName
  let computerFundamentals
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
          'ManageCommunitySuite.subOrg.designFrontend.subOrg.instructionSession.communities.computerFundamentals'
        )
        .then((data) => {
          computerFundamentals = data.label
        })
    })

    beforeEach(() => {
      orgManageCommunity.accessToManageCommunity()
    })

    it('Org Admin change owner anyone from organization from the search drop-down and not remove previous owner', () => {
      Story.ticket('QA-448')
      orgManageCommunity.resetUserOwner(
        computerFundamentals,
        orgAdminGivenName,
        auLearnMgtAdminScreenName
      )
      orgManageCommunity.changeOwnerAndVerify(
        computerFundamentals,
        auLearnMgtAdminScreenName,
        false,
        learningAdminEmail
      )
      orgManageCommunity.revertPreviousOwner(computerFundamentals, orgAdminGivenName)
    })
  })
})
