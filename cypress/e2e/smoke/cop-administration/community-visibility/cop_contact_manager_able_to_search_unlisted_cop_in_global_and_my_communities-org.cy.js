import CommunityVisibility from '../../../../classes/cop/cop-administration/admin/CommunityVisibility'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import SignInAsCoP from '../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPAdministration, () => {
  const coPAdminMock = new CoPAdminMock()
  const signInAsCoP = new SignInAsCoP()
  const communityVisibility = new CommunityVisibility()

  before(() => {
    coPAdminMock.setSmokeCommunity()
    signInAsCoP.contactManager_Murl()
  })

  context(Story.communityVisibility, () => {
    it('CoP Contact Manager able to search Unlisted CoP in global search & My communities list - Org', () => {
      Story.ticket('QA-739')

      communityVisibility.expectUnlistedCopFoundInGlobalSearch(
        `${coPAdminMock.getOCoPUnlistedNameUrl()}`
      )
      communityVisibility.expectUnlistedCopFoundInCommunitySearch(
        `${coPAdminMock.getOCoPUnlistedNameUrl()}`
      )
    })
  })
})
