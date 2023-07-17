import CommunityVisibility from '../../../../classes/cop/cop-administration/admin/CommunityVisibility'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.CoPAdministration, { tags: '@skipPrd' }, () => {
  const coPAdminMock = new CoPAdminMock()
  const communityVisibility = new CommunityVisibility()

  before(() => {
    coPAdminMock.setSmokeCommunity()
    SignInAs.cwUser()
  })

  context(Story.communityVisibility, () => {
    it('CW User able to search Standard CoP in global search - MW', () => {
      Story.ticket('QA-573')

      communityVisibility.expectStandardCopFoundInGlobalSearch(
        `${coPAdminMock.getMWCoPStandardNameUrl()}`
      )
    })
  })
})
