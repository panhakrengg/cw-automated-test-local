import CommunityVisibility from '../../../../classes/cop/cop-administration/admin/CommunityVisibility'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.CoPAdministration, { tags: '@skipPrd' }, () => {
  const coPAdminMock = new CoPAdminMock()
  const communityVisibility = new CommunityVisibility()

  beforeEach(() => {
    coPAdminMock.setSmokeCommunity()
    SignInAs.cwUser()
  })

  context(Story.communityVisibility, () => {
    it('CW User not able to search Unlisted CoP in global search & access via link - MW', () => {
      Story.ticket('QA-572')

      communityVisibility.searchThenExpectCannotFindCop(
        `"${coPAdminMock.getMwCoPUnlistedNameUrl()}"`
      )
      communityVisibility.visitThenExpectSeeAccessDenied(coPAdminMock.getMwCoPUnlistedHomeUrl())
    })
  })
})
