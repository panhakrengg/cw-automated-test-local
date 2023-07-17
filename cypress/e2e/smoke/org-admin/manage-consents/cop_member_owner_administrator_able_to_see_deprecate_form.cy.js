import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import ManageCopConsent from '../../../../classes/org-management/org-admin/ManageCopConsent'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import WaitUtil from '../../../../classes/utilities/WaitUtil'

describe(Epic.OrgAdmin, () => {
  let copUrlHome
  const manageConsent = new ManageConsent()
  const manageCopConsent = new ManageCopConsent()

  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentMockUp = YAML.parse(consentString)
      manageConsent.setMockUpData(consentMockUp)
      copUrlHome =
        consentMockUp.ConsentSuite.orgMgt.rootOrg.webLearnUnit.communities.computerDeprecatedForm
          .url
    })
  })

  context(Story.orgAdminManageConsents, () => {
    it('CoP Owner, Member, Administrator able to see deprecate a form in use by CoP still be in used', () => {
      Cypress.on('uncaught:exception', () => false)
      Story.ticket('QA-859')

      WaitUtil.setAllResourceLoaded()

      cy.logInTestCase('CoP Owner')
      SignInAs.orgAdmin(copUrlHome)
      cy.get('.popup-consent-form-wrapper').as('popup')
      manageCopConsent.expectEnableAcceptConsent()

      cy.logInTestCase('CoP Member')
      SignInAs.reSignInOrgMemberDesignFrontend(copUrlHome)
      cy.get('.popup-consent-form-wrapper').as('popup')
      manageCopConsent.expectEnableAcceptConsent()

      cy.logInTestCase('CoP Administrator')
      SignInAs.reSignInCoPOwnerDesignFrontend(copUrlHome)
      cy.get('.popup-consent-form-wrapper').as('popup')
      manageCopConsent.expectEnableAcceptConsent()
    })
  })
})
