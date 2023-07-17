import AdminSettings from '../../../../classes/cop/cop-administration/admin/AdminSettings'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import SignInAsCoP from '../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'

describe(Epic.CoPAdministration, () => {
  const coPAdminMock = new CoPAdminMock()
  const adminSettings = new AdminSettings()
  const signInAsCoP = new SignInAsCoP()
  before(() => {
    coPAdminMock.setSmokeCommunity()
  })

  context(Story.communitySettings, () => {
    it('Cop Contact Manager see page not found when access Setting page - Org Training', () => {
      Story.ticket('QA-720', ['CW-16516'])
      signInAsCoP.contactManager_Murl()
      adminSettings.setUrl(coPAdminMock.getTCoPSmokeAdminUrl())

      adminSettings.visitAdminSettingsPage(false)

      adminSettings.expectToSeePageNotFound()
    })

    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
