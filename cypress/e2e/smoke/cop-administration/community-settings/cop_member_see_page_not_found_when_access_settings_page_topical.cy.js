import AdminSettings from '../../../../classes/cop/cop-administration/admin/AdminSettings'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import SignInAsCoP from '../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'

describe(Epic.CoPAdministration, { tags: '@skipPrd' }, () => {
  const coPAdminMock = new CoPAdminMock()
  const adminSettings = new AdminSettings()
  const signInAsCoP = new SignInAsCoP()
  before(() => {
    coPAdminMock.setSmokeCommunity()
  })

  context(Story.communitySettings, () => {
    it('CoP Member see page not found when access Setting page - Topical', () => {
      Story.ticket('QA-717', ['CW-16516'])
      signInAsCoP.member_Enola()
      adminSettings.setUrl(coPAdminMock.getTPCoPSmokeAdminUrl())

      adminSettings.visitAdminSettingsPage(false)

      adminSettings.expectToSeePageNotFound()
    })
    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
