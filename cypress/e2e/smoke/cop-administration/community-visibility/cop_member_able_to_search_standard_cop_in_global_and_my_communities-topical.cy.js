import CommunityVisibility from '../../../../classes/cop/cop-administration/admin/CommunityVisibility'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import SignInAsCoP from '../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPAdministration, { tags: '@skipPrd' }, () => {
  const coPAdminMock = new CoPAdminMock()
  const signInAsCoP = new SignInAsCoP()
  const communityVisibility = new CommunityVisibility()

  before(() => {
    coPAdminMock.setSmokeCommunity()
    signInAsCoP.member_Enola()
  })

  context(Story.communityVisibility, () => {
    it('CoP Member able to search Standard CoP in global search & My communities list - Topical', () => {
      Story.ticket('QA-1922')

      communityVisibility.expectStandardCopFoundInGlobalSearch(
        `${coPAdminMock.getTPCoPStandardNameUrl()}`
      )
      communityVisibility.expectStandardCopFoundInCommunitySearch(
        `${coPAdminMock.getTPCoPStandardNameUrl()}`
      )
    })
  })
})
