import Epic from '../../../../classes/Epic'
import Settings from '../../../../classes/org-management/org-admin/Settings'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  context(Story.settings, () => {
    const settings = new Settings()

    it('Org Admin change branding favicon', () => {
      Story.ticket('158')
      cy.logInTestCase('Access to org setting')
      settings.accessOrgSettingsViaOrgAdmin()
      settings.goToBranding()

      cy.logInTestCase('Reset data')
      settings.verifyRemoveOrgFavicon()

      cy.logInTestCase('Change branding favicon')
      settings.uploadOrgFavicon('attachments/cw-circle-logo.png')
    })
  })
})
