import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, { tags: '@skipPrd' }, () => {
  context(Story.orgAdminManageConsents, () => {
    let consentSettings

    before(() => {
      cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
        const { welcomeToWebLearnOrganization } = YAML.parse(consentString)['ExistingConsentForms']
        SignInAs.orgMember()
        consentSettings = new ConsentSettings(welcomeToWebLearnOrganization)
        consentSettings.visit()
      })
    })

    it('Org Member able to see given organization consent', () => {
      Story.ticket('QA-508')
      consentSettings.accessConsentTab('Others')
      consentSettings.verifyConsentItem()
    })

    after(() => {
      ReportDefect.markAsPrdCwDefect(
        'Org admin force existing members to accept organization form but it not appear'
      )
    })
  })
})
