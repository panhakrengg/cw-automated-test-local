import Epic from '../../../../classes/Epic'
import Settings from '../../../../classes/org-management/org-admin/Settings'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, {retries:2},() => {
  context(Story.settings, () => {
    const settings = new Settings()

    it('Org Admin update text on custom support page', () => {
      Cypress.on('uncaught:exception', () => false) //To prevent getting error from CkEditor on CW Application
      Story.ticket('QA-499')

      cy.logInTestCase('SignIn as Org Admin and navigate to organization setting')
      settings.accessOrgSettingsViaOrgAdmin()
      settings.goToCustomSupportPage()

      cy.logInTestCase('Revert custom support page')
      settings.revertCustomSupportPageText()

      cy.logInTestCase('Verify update custom support page')
      settings.verifyUpdateCustomSupportPage()
    })
  })
})
