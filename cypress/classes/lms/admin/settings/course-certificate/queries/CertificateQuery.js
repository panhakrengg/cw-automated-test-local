import CertificateConstant from '../constants/CertificateConstant'

export default class CertificateQuery {
  isDefaultCertificate = true
  getLabelCertificate() {
    return cy.getElementWithLabel(CertificateConstant.CERTIFICATES, '.text-decoration-none')
  }
  getCertificateElementId() {
    return this.isDefaultCertificate
      ? '#_settingPortlet_defaultCertificate'
      : '#_settingPortlet_externalCertificate'
  }
  getManageLearnerTable(subject, element) {
    return cy.get('.manage-people table').last()
  }
  getCertificateContentBlock() {
    return cy.getElementWithLabel(CertificateConstant.TEXT_ON_CERTIFICATE).first().parent()
  }
  getInputCertificate() {
    return cy.getInputByPlaceholder(CertificateConstant.CERTIFICATE)
  }
  getInputOfCompletion() {
    return cy.getInputByPlaceholder(CertificateConstant.OFF_COMPLETION)
  }
  getInputIsPresentedTo() {
    return cy.getInputByPlaceholder(CertificateConstant.IS_PRESENTED_TO)
  }
  getInputForSuccessfullyCompleting() {
    return cy.getInputByPlaceholder(CertificateConstant.FOR_SUCCESSFULLY_COMPLETING)
  }
  getInputIssuedOn() {
    return cy.getInputByPlaceholder(CertificateConstant.ISSUED_ON)
  }
  getInputName1() {
    return cy.getInputByPlaceholder(CertificateConstant.NAME).first()
  }
  getInputPosition1() {
    return cy.getInputByPlaceholder(CertificateConstant.POSITION).first()
  }
  getInputName2() {
    return cy.getInputByPlaceholder(CertificateConstant.NAME).last()
  }
  getInputPosition2() {
    return cy.getInputByPlaceholder(CertificateConstant.POSITION).last()
  }
  getButtonSave() {
    return cy.getElementWithLabel(CertificateConstant.SAVE, 'button')
  }
  getLanguageSection() {
    return cy.get('.item-selection').first()
  }
  getAddLanguageIcon() {
    return cy.get('.add-icon')
  }
  getAwardCertificateToggleSwitch() {
    cy.getElementWithLabel('Course Completion')
      .next()
      .last()
      .within(() => {
        cy.get('.cw-toggle-button input:first').as('awardCertificateSwitch')
      })
  }
  getExpertiseAndQualificationTab() {
    return cy
      .getElementWithLabel(CertificateConstant.EXPERTISE_QUALIFICATION, 'div')
      .parent('.e-text-wrap')
      .first()
  }
}
