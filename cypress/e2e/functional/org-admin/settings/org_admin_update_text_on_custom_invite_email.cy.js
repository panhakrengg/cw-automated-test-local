import Epic from '../../../../classes/Epic'
import Settings from '../../../../classes/org-management/org-admin/Settings'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, {retries:2},() => {
  context(Story.settings, () => {
    const settings = new Settings()

    it('Org Admin update text on custom invite email', () => {
      Story.ticket('QA-555')
      settings.accessOrgSettingsViaOrgAdmin()
      settings.goToCustomEmail()

      cy.logInTestCase('Reset Data')
      settings.removeUpdateTextInCustomInviteEmail()

      cy.logInTestCase(
        'Customize the email that users receive when they get invited to join your organization'
      )
      settings.updateCustomInviteEmail()
      settings.removeUpdateTextInCustomInviteEmail()
    })
  })
})
