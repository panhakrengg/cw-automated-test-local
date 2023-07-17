import InterceptAction from '../../base/InterceptAction'
import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import SignInAs from '../../utilities/SignInAs'
import WaitUtil from '../../utilities/WaitUtil'

class ManageCopConsent {
  #itcFetchSettingConsentSearch = new InterceptReq(
    '/setting/consent/search',
    'fetchSettingConsentSearch'
  )

  #itcFetchConsentFormInstance = new InterceptReq(
    '/setting/consent/instance/get',
    'fetchConsentFormInstance'
  )

  #itcSaveConsentForm = new InterceptReq('/setting/consent/save_consent_form', 'saveConsent')

  #itcFetchConsentForm = new InterceptReq('/consent_form/fetch', 'fetchConsentForm')
  #itcConsentCoPAgree = new InterceptAction('/consent_form/agree', 'consentCoPAgree')

  itcSaveConsentFormSet() {
    this.#itcSaveConsentForm.set()
  }

  itcSaveConsentFormWait() {
    this.#itcSaveConsentForm.wait()
  }

  itcConsentCoPAgreeSet() {
    this.#itcConsentCoPAgree.set()
  }
  itcConsentCoPAgreeWait() {
    this.#itcConsentCoPAgree.wait()
  }
  itcConsentFormSet() {
    this.#itcFetchConsentForm.set()
  }
  itcConsentFormWait() {
    this.#itcFetchConsentForm.wait()
  }
  itcSet() {
    this.#itcFetchConsentFormInstance.set()
    this.#itcFetchSettingConsentSearch.set()
  }
  itcWait() {
    this.#itcFetchConsentFormInstance.wait()
    this.#itcFetchSettingConsentSearch.wait()
  }
  accessToManageConsentByUrl(url) {
    this.itcSet()
    cy.visit(url)
    this.itcWait()
  }
  accessToManageConsent() {
    cy.get('#_copMemberManagementPortlet_cw-dropdown_').click()
    cy.intercept('**consent%2Finstance%2Fget').as('fetchConsentInstance')
    cy.get('.dropdown-menu li').contains('Manage Consent').click()
    cy.wait('@fetchConsentInstance')
  }
  enableConsent() {
    cy.wait(1000)
    cy.get('.consent-card').within(($consentCard) => {
      cy.intercept('**fetch_predefined_forms').as('fetchPredefinedForm')
      cy.wrap($consentCard).get('.slider').click()
    })
    cy.wait('@fetchPredefinedForm')
  }
  selectConsentForm() {
    cy.get('.popup-consent-form-wrapper').as('popup')
  }
  acceptConsentForm() {
    cy.get('.portlet-body').then(($body) => {
      if ($body.find('.popup-consent-form-wrapper').length) {
        this.selectConsentForm()
        this.itcConsentCoPAgreeSet()
        this.acceptConsent()
        cy.wait(5000)
      }
    })
  }
  acceptConsentFormWithoutInput() {
    this.itcConsentCoPAgreeSet()
    cy.clickAgreeConsentFormButton()
    this.itcConsentCoPAgreeWait()
  }
  resetDataEnsureCoPHomeAcceptConsent(copHomeUrl) {
    Cypress.on('uncaught:exception', () => false)
    WaitUtil.setAllResourceLoaded()
    SignInAs.orgAdmin(copHomeUrl)
    this.acceptConsentForm()
  }
  replaceConsent(name) {
    this.itcSaveConsentFormSet()
    cy.get('.consent-card').within(($consentCard) => {
      const $threeDot = cy.wrap($consentCard).getThreeDots()
      $threeDot.click()
      $threeDot.clickDropdownName(Field.REPLACE)
    })
    this.selectPredefinedForm(name)
    cy.get('button').contains(Field.NEXT).click()
    cy.get('button').contains(Field.REPLACE).click()
    cy.swal2Confirm(Field.YES_REPLACE).click()
    this.#itcSaveConsentForm.wait()
  }
  acceptConsent() {
    cy.get('.popup-consent-form-wrapper').within(($popup) => {
      cy.wrap($popup)
        .getPopupBody()
        .within(($popupConsent) => {
          cy.wrap($popupConsent).find('input').first().check()
          cy.wrap($popupConsent).find('input:nth-child(1)').check()
        })
      cy.wrap($popup)
        .getPopupFooter()
        .within(($footer) => {
          this.itcConsentCoPAgreeSet()
          cy.wrap($footer).find('button.btn-primary').click()
          this.itcConsentCoPAgreeWait()
        })
    })
  }
  expectEnableAcceptConsent() {
    cy.get('@popup').within(($popup) => {
      cy.wrap($popup).getPopupFooter().find('button.btn-primary').as('yesIAgree')
      cy.get('@yesIAgree').should('be.disabled')
      cy.wrap($popup)
        .getPopupBody()
        .within(($popupConsent) => {
          cy.wrap($popupConsent).find('input').first().check()
          cy.wrap($popupConsent).find('input:nth-child(1)').check()
        })
      cy.get('@yesIAgree').should('be.enabled')
    })
  }
  expectAvailablePredefinedForm(name) {
    this.getPredefinedContainer().should('contain.text', name)
  }
  expectNotAvailablePredefinedForm(name) {
    this.getPredefinedContainer().should('not.contain.text', name)
  }
  selectPredefinedForm(name) {
    this.getPredefinedContainer().contains(name).click()
  }
  getPredefinedContainer() {
    return cy.get('.scroll-content > .justify-content-between')
  }
  expectEnableNextButton() {
    cy.get('.manage-consent-form-wrapper').within(($consentFormPopup) => {
      cy.wrap($consentFormPopup)
        .get('button')
        .contains(Field.NEXT)
        .should('not.have.class', 'disabled')
    })
  }
}

export default ManageCopConsent
