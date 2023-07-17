import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import ManageCopConsent from '../../../../classes/org-management/org-admin/ManageCopConsent'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  let formName
  let copName
  let copUrlHome
  const manageConsent = new ManageConsent()
  const manageCopConsent = new ManageCopConsent()
  const fake = new Faker()
  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentMockUp = YAML.parse(consentString)
      manageConsent.setMockUpData(consentMockUp)
      formName = consentMockUp.ExistingConsentForms.opportunityPolicyOnExitedMembers.name
      const copHome =
        consentMockUp.ConsentSuite.orgMgt.rootOrg.webLearnUnit.subOrg.designFrontend.subOrg
          .instructionSession.subOrg.organizationConsentForm.communities.oCoPConsentFormExitMember
      copName = copHome.name
      copUrlHome = copHome.url
    })
  })
  context(Story.orgAdminManageConsents, () => {
    it('Org Admin change consent form for community and existing must agree to change', () => {
      Story.ticket('QA-479')
      manageConsent.accessToManageOrgConsent()
      const editName = fake.randomName(formName)
      manageConsent.clickEditForm(formName)
      manageConsent.enterFormName(editName)
      manageConsent.checkExisting()
      manageConsent.save()

      describe('Show a new consent popup', () => {
        SignInAs.orgMemberOrganizationConsent()
        cy.visit(copUrlHome)
        cy.get('.popup-consent-form-wrapper').as('popup')
        cy.get('@popup').should('contain.text', editName)
      })

      describe('Click close and reload cop page still show popup', () => {
        cy.get('@popup').closePopup()
        cy.reload()
        cy.get('@popup').should('contain.text', editName)
      })

      describe('Click accept consent form and reload cop page will not show popup', () => {
        manageCopConsent.itcConsentCoPAgreeSet()
        manageCopConsent.acceptConsent()
      })

      describe('Org Admin uncheck existing must agree to change', () => {
        cy.signOut()
        manageConsent.accessToManageOrgConsent()
        manageConsent.clickEditForm(formName)
        manageConsent.uncheckExisting()
        manageConsent.save()
      })

      describe('Not show consent popup', () => {
        SignInAs.orgMemberOrganizationConsent()
        cy.visit(copUrlHome)
        cy.get('.popup-consent-form-wrapper').should('not.exist')
      })
    })
  })
})
