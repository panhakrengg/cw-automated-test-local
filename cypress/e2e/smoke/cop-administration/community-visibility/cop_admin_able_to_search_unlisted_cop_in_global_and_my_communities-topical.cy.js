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
    signInAsCoP.admin_Kendal()
  })

  context(Story.communityVisibility, () => {
    it('CoP Admin able to search Unlisted CoP in global search & My communities list - Topical', () => {
      Story.ticket('QA-731')

      communityVisibility.expectUnlistedCopFoundInGlobalSearch(
        `${coPAdminMock.getTPCoPUnlistedNameUrl()}`
      )
      communityVisibility.expectUnlistedCopFoundInCommunitySearch(
        `${coPAdminMock.getTPCoPUnlistedNameUrl()}`
      )
    })
  })
})
