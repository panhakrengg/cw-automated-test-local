import CommunityVisibility from '../../../../classes/cop/cop-administration/admin/CommunityVisibility'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.CoPAdministration, () => {
  const coPAdminMock = new CoPAdminMock()
  const communityVisibility = new CommunityVisibility()

  beforeEach(() => {
    coPAdminMock.setSmokeCommunity()
    SignInAs.cwUser()
  })

  context(Story.communityVisibility, () => {
    it('CW User not able to search Standard CoP from organization in global search & access via link - Org', () => {
      Story.ticket('QA-1928', ['CW-16103'])

      communityVisibility.searchThenExpectCannotFindCop(
        `"${coPAdminMock.getOCoPStandardNameUrl()}"`
      )
      communityVisibility.visitThenExpectSeeAccessDenied(coPAdminMock.getOCoPStandardHomeUrl())
    })
  })
})
