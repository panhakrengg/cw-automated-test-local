import CommunityVisibility from '../../../../classes/cop/cop-administration/admin/CommunityVisibility'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import Epic from '../../../../classes/Epic'
import SignInAs from '../../../../classes/utilities/SignInAs'
import Story from '../../../../classes/Story'

describe(Epic.CoPAdministration, () => {
  const coPAdminMock = new CoPAdminMock()
  const communityVisibility = new CommunityVisibility()

  before(() => {
    coPAdminMock.setSmokeCommunity()
    SignInAs.member_Arielle()
  })

  context(Story.communityVisibility, () => {
    it('Org Member able to search Standard CoP in global search - Training', () => {
      Story.ticket('QA-745')

      communityVisibility.expectStandardCopFoundInGlobalSearch(
        `${coPAdminMock.getTCoPStandardNameUrl()}`
      )
    })
  })
})
