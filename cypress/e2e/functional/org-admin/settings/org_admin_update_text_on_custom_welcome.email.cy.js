import Epic from '../../../../classes/Epic'
import Settings from '../../../../classes/org-management/org-admin/Settings'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, {retries:2},() => {
  context(Story.settings, () => {
    const settings = new Settings()

    it('Org Admin update text on custom welcome email', () => {
      Story.ticket('QA-2050')
      settings.accessOrgSettingsViaOrgAdmin()
      settings.goToCustomEmail()

      cy.logInTestCase('Reset Data')
      settings.removeUpdateTextInCustomWelcomeEmail()

      cy.logInTestCase(
        'Customize the welcome email users receive after they join your organization'
      )
      settings.updateCustomWelcomeEmail()
      settings.removeUpdateTextInCustomWelcomeEmail()
    })
  })
})
