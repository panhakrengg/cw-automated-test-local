import Environment from '../../../base/Environment'
import InterceptReq from '../../../base/InterceptReq'
import CourseList from './CourseList'

class SetUpConsent {
  #env = new Environment()

  #clickManageConsentSidebar() {
    Itc.getInstanceConsentSetting.set()
    cy.clickLinkByName('Manage Consent')
    Itc.getInstanceConsentSetting.wait()
  }

  #enableConsent() {
    Itc.fetchPredefinedForm.set()
    cy.get('.consent-card').within(($card) => {
      cy.wrap($card).toggleSwitch()
    })
    if (!this.#env.isLocal()) Itc.fetchPredefinedForm.wait()
  }

  #clickCreateCustomConsent() {
    cy.getElementWithLabel('Create a Custom Form', 'span').click()
    cy.wait(500)
  }

  #addItem(consentItem) {
    cy.clickLinkByName('Add consent item')
    Itc.fetchItemConsentSystem.wait()

    cy.swal2().within(($popup) => {
      const { shortLabel, description, optional } = consentItem
      cy.inputFormGroup('Short label', shortLabel)
      cy.typeInEditor(description)
      if (optional) cy.wrap($popup).checkboxByLabel('Optional', 'span').check()
      cy.clickPrimaryButton('Add')
      cy.wait(500)
    })
  }

  #addItems(items) {
    Itc.fetchItemConsentSystem.set()

    for (const [key, value] of Object.entries(items)) {
      this.#addItem(value)
    }
  }

  #fillConsent(consent) {
    const { formName, description, consentItems } = consent

    cy.inputFormGroup('Form name', formName)
    cy.typeInEditor(description)
    this.#addItems(consentItems)
  }

  #clickButtonSave() {
    Itc.searchConsentSettings.set()
    cy.clickButtonByName('Save')
    cy.waitLoadingOverlayNotExist()
    Itc.getInstanceConsentSetting.wait()
    Itc.searchConsentSettings.wait()
  }

  #createCustomConsent(consent) {
    this.#enableConsent()
    this.#clickCreateCustomConsent()
    this.#fillConsent(consent)
    this.#clickButtonSave()
  }

  clickManageConsentThenCreate(consent) {
    this.#clickManageConsentSidebar()
    this.#createCustomConsent(consent)
  }

  searchCourseThenCreateConsent(courseName, consent) {
    const courseList = new CourseList()

    courseList.visitThenSearchCourse(false, courseName)
    courseList.clickCourseName(courseName)
    this.#clickManageConsentSidebar()
    this.#createCustomConsent(consent)
  }
}

class Itc {
  static getInstanceConsentSetting = new InterceptReq(
    '/setting/consent/instance/get',
    'GetInstanceConsentSetting'
  )
  static fetchPredefinedForm = new InterceptReq(
    '/setting/consent/fetch_predefined_forms',
    'FetchPredefinedForm'
  )
  static fetchItemConsentSystem = new InterceptReq(
    '/system/consent/item/fetch',
    'FetchItemConsentSystem'
  )
  static searchConsentSettings = new InterceptReq(
    '/setting/consent/search',
    'SearchConsentSettings'
  )
}

export default SetUpConsent
