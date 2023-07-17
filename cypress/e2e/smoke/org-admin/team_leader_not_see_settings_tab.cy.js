import Epic from '../../../classes/Epic'
import Settings from '../../../classes/org-management/org-admin/Settings'
import Story from '../../../classes/Story'
import ReportDefect from '../../../classes/utilities/ReportDefect'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  const settings = new Settings()

  context(Story.settings, () => {
    it('Team Leader can not see settings tab', () => {
      Story.ticket('QA-156', ['CW-16516'])
      SignInAs.teamLeaderRootOrgUnit()
      cy.visit(settings.getOrgSettingUrl(), { failOnStatusCode: false })
      cy.pageNotFound()
    })

    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
