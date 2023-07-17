import Epic from '../../../../classes/Epic'
import Settings from '../../../../classes/org-management/org-admin/Settings'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'

const settings = new Settings()

describe(Epic.OrgAdmin, () => {
  let testEmail

  context(Story.settings, () => {
    before(() => {
      cy.readFile('cypress/fixtures/emails.yaml').then((emailString) => {
        testEmail = YAML.parse(emailString).Emails.test.email
      })
    })

    beforeEach(() => {
      settings._itcSupportPage.set()
      settings._itcCustomEmail.set()
    })
    it('Org Admin enable custom support page and member see support page', () => {
      Story.ticket('QA-167')
      describe('Org Admin enable custom support page', () => {
        settings.accessOrgSettingsViaOrgAdmin()
        settings.openSupportPage()
        settings.resetToggleToTurnOff(settings._itcSupportPage)
        settings.toggleSwitch(settings._itcSupportPage)
        settings.expectedEnabledToggle()
        settings.expectedOpenToastMessage()
        cy.reload(true)
        settings.expectedSupportPageInMegaMenu()
      })

      describe('Verify org member see custom support page', () => {
        settings.signInAsOrgMember()
        settings.expectedSupportPageInMegaMenu()
      })
    })

    it('Org Admin disabled custom support page and member not see support page', () => {
      Story.ticket('QA-265')
      describe('Org Admin disabled custom support page', () => {
        settings.accessOrgSettingsViaOrgAdmin()
        settings.openSupportPage()
        settings.resetToggleToTurnOn(settings._itcSupportPage)
        settings.expectedEnabledToggle()
        settings.toggleSwitch(settings._itcSupportPage)
        settings.expectedOpenToastMessage()
        cy.reload(true)
        settings.expectedSupportPageNotInMegaMenu()
      })

      describe('Verify org member not see support page', () => {
        settings.signInAsOrgMember()
        settings.expectedSupportPageNotInMegaMenu()
      })
    })

    it('Org Admin disable custom email invite users', () => {
      Story.ticket('QA-502')
      settings.accessOrgSettingsViaOrgAdmin()
      settings.openCustomEmail()
      settings.resetToggleToTurnOn(settings._itcCustomEmail)
      settings.expectedEnabledToggle()
      settings.toggleSwitch(settings._itcCustomEmail)
      settings.expectedOpenToastMessage()
      settings.inviteUserViaEmail(testEmail)
      settings.expectedInvitationEmailSentDefaultMessage(testEmail)
    })

    it('Org Admin enable custom email invite users', () => {
      Story.ticket('QA-165')
      settings.accessOrgSettingsViaOrgAdmin()
      settings.openCustomEmail()
      settings.resetToggleToTurnOff(settings._itcCustomEmail)
      settings.toggleSwitch(settings._itcCustomEmail)
      settings.expectedOpenToastMessage()
      settings.inviteUserViaEmail(testEmail)
      settings.expectedInvitationEmailSentCustomMessage(testEmail)
    })
  })
})
