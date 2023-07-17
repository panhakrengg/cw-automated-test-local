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

  context(Story.communitySettings, () => {
    before(() => {
      coPAdminMock.setSmokeCommunity()
    })
    it('CoP Member see page not found when access Setting page - MW', () => {
      Story.ticket('QA-597', ['CW-16516'])
      cy.logInTestCase('Sign In And Visit Admin Setting Page')
      signInAsCoP.member_Enola()
      adminSettings.setUrl(coPAdminMock.getMwCoPSmokeAdminUrl())
      adminSettings.visitAdminSettingsPage(false)

      cy.logInTestCase('Expect To See Page Not Found')
      adminSettings.expectToSeePageNotFound()
    })

    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
