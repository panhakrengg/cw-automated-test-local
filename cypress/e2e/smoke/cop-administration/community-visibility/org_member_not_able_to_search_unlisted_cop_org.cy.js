import CommunityVisibility from '../../../../classes/cop/cop-administration/admin/CommunityVisibility'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import Epic from '../../../../classes/Epic'
import SignInAs from '../../../../classes/utilities/SignInAs'
import Story from '../../../../classes/Story'

describe(Epic.CoPAdministration, () => {
  const coPAdminMock = new CoPAdminMock()
  const communityVisibility = new CommunityVisibility()

  beforeEach(() => {
    coPAdminMock.setSmokeCommunity()
    SignInAs.member_Arielle()
  })

  context(Story.communityVisibility, () => {
    it('Org Member not able to search Unlisted CoP in global search & access via link - Org', () => {
      Story.ticket('QA-741', ['CW-16103'])

      communityVisibility.searchThenExpectCannotFindCop(
        `"${coPAdminMock.getOCoPUnlistedNameUrl()}"`
      )
      communityVisibility.visitThenExpectSeeAccessDenied(coPAdminMock.getOCoPUnlistedHomeUrl())
    })
  })
})
