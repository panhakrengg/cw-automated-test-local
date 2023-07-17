import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, () => {
  context(Story.orgAdminManageConsents, () => {
    let consentSettings = new ConsentSettings()

    before(() => {
      cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
        const { welcomeToWebLearnOrganization } = YAML.parse(consentString)['ExistingConsentForms']
        cy.visitThenSignIn('/', UserRole.ORG_MEMBER.EXITED)
        consentSettings = new ConsentSettings(welcomeToWebLearnOrganization)
        consentSettings.visit()
      })
    })

    it('Org Member that exited organization see given organization consent', () => {
      Story.ticket('QA-509')
      consentSettings.accessConsentTab('Others')
      consentSettings.verifyConsentItem()
    })
  })
})
