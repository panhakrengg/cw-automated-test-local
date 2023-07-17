import CertificateConstant from '../constants/CertificateConstant'
import CertificateItc from '../intercepts/CertificateItc'
import CertificateQuery from '../queries/CertificateQuery'
export default class CertificateAssertion extends CertificateQuery {
  verifyCertificate() {
    cy.task('readPdf', './cypress/downloads/Certificate.pdf').then((textOrNull) => {
      console.log('TASK=>', textOrNull)
    })
  }
  expectCertificateLanguageNotExist(language) {
    cy.getCwSplitDropdownMenuItems().within(($items) => {
      cy.wrap($items).should('not.contains.text', language)
    })
  }
  expectCertificateLanguageExist(language) {
    cy.getCwSplitDropdownMenuItems().within(($items) => {
      cy.wrap($items).should('contains.text', language)
    })
  }
  expectCertificateLanguageExist(language) {
    cy.getCwSplitDropdownMenuItems().within(($items) => {
      cy.wrap($items).should('contains.text', language)
    })
  }
  expectCertificateIsVisible() {
    cy.get('.certificate-award-wrapper').should('be.visible')
    cy.getElementWithLabel(CertificateConstant.CERTIFICATE_OF_COMPLETION, 'div').should(
      'be.visible'
    )
  }
  expectCertificateIsListed(name) {
    cy.getElementWithLabel(name, 'div').should('be.visible')
  }
  expectCertificateIsNotVisible() {
    cy.get('.certificate-award-wrapper').should('not.exist')
    cy.getElementWithLabel(CertificateConstant.CERTIFICATE_OF_COMPLETION, 'div').should('not.exist')
  }
  expectCertificateIsNotListed(name) {
    cy.getElementWithLabel(name, 'div').should('not.exist')
  }
}
