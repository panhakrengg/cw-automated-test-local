import Epic from '../../../../classes/Epic'
import Settings from '../../../../classes/org-management/org-admin/Settings'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  context(Story.settings, () => {
    const settings = new Settings()

    before(() => {
      settings.accessOrgSettingsViaOrgAdmin()
    })

    it('Org Admin checks available password length', () => {
      Story.ticket('QA-500')
      settings.goToAccountSecurity()
      settings.verifyMinimumPasswordLength()
      settings.verifyMaximumPasswordLength()
    })
  })
})
