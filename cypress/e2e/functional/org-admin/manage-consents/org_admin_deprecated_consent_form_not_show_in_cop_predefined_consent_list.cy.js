import InterceptReq from '../../../../classes/base/InterceptReq'
import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import ManageCopConsent from '../../../../classes/org-management/org-admin/ManageCopConsent'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  let form
  let formName
  let copUrl
  const manageConsent = new ManageConsent()
  const manageCopConsent = new ManageCopConsent()
  const itcFetchMembers = new InterceptReq('/admin/fetch_manage_members', 'fetchMembers')

  const accessToCopAdminTab = () => {
    itcFetchMembers.set()
    cy.visit(`${copUrl}/admin/admin`)
    itcFetchMembers.wait()
  }

  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentMockUp = YAML.parse(consentString)
      manageConsent.setMockUpData(consentMockUp)
      form = consentMockUp.CreateConsentForms.auTattooConsentFormDeprecated
      formName = form.name.new
      copUrl =
        consentMockUp.ConsentSuite.orgMgt.rootOrg.webLearnUnit.communities
          .webLearnConsentOrgAutomate.url
    })
  })

  context(Story.orgAdminManageConsents, () => {
    it('Org Admin deprecate form type community not show in cop predefined consent list', () => {
      Story.ticket('QA-406')
      SignInAs.orgAdmin()
      manageConsent.cleanUpConsentFormByDelete(formName)

      manageConsent.createForm(form)
      manageConsent.save()
      manageConsent.showEntry('75')
      manageConsent.markAsDeprecated(formName)

      accessToCopAdminTab()
      manageCopConsent.accessToManageConsent()
      manageCopConsent.enableConsent()
      manageCopConsent.expectNotAvailablePredefinedForm(formName)

      manageConsent.cleanUpConsentFormByDelete(formName)
    })
  })
})
