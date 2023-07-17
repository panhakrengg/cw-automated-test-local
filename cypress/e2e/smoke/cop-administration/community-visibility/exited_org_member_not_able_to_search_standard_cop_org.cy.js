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
    SignInAs.exited_Hazle()
  })

  context(Story.communityVisibility, () => {
    it('Exited Org Member not able to search Standard CoP in global search & access via link - Org', () => {
      Story.ticket('QA-1926', ['CW-16103'])

      communityVisibility.searchThenExpectCannotFindCop(
        `"${coPAdminMock.getOCoPStandardNameUrl()}"`
      )
      communityVisibility.visitThenExpectSeeProductSubscription(
        coPAdminMock.getOCoPStandardHomeUrl()
      )
    })
  })
})
