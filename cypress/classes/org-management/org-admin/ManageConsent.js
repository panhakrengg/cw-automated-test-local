import InterceptAction from '../../base/InterceptAction'
import InterceptReq from '../../base/InterceptReq'
import CourseConsentPopupAssertion from '../../consent/assertion/CourseConsentPopupAssertion'
import Field from '../../constants/Field'
import Booking from '../../course/Booking'
import CourseDetail from '../../lms/CourseDetail'
import ManagePeopleInstance from '../../lms/admin/course-instance/ManagePeopleInstance'
import SignInAs from '../../utilities/SignInAs'
import WaitUtil from '../../utilities/WaitUtil'
import { OrgConst } from '../base-org-management/OrgStub'

class ManageConsent {
  #mockUpData
  #itcFetchConsentForm = new InterceptReq('/setting/consent_form/get', 'fetchConsentForms')

  #itcFetchConsentFormInstance = new InterceptReq(
    '/setting/consent/instance/get',
    'fetchConsentFormInstance'
  )

  #itcCreateConsentForm = new InterceptReq('/setting/consent/modify', 'createForm')

  #itcFetchSettingConsent = new InterceptReq('/setting/consent/fetch', 'fetchSettingConsent')

  #itcFetchConsentItem = new InterceptReq('/system/consent/item/fetch', 'fetchConsentItem')

  #itcModifyConsentStatus = new InterceptReq(
    '/setting/consent/status/modify',
    'ModifyConsentStatus'
  )

  #itcDeprecateConsentForm = new InterceptAction(
    '/setting/consent_form/deprecate',
    'DeprecateConsentForm'
  )

  #itcDeleteConsentForm = new InterceptReq('/setting/consent_form/delete', 'DeleteConsentForm')

  constructor(mockUpData) {
    this.#mockUpData = mockUpData
  }

  setMockUpData(mockUpData) {
    this.#mockUpData = mockUpData
  }

  accessToManageOrgConsent() {
    Cypress.on('uncaught:exception', () => false)
    this.#itcFetchConsentForm.set()
    WaitUtil.setAllResourceLoaded()
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_CONSENTS)
    this.#itcFetchConsentForm.wait()
    cy.waitLoadingOverlayNotExist()
    this.showEntry('75')
  }
  showEntry(entry) {
    cy.get('.manage-consent-form-wrapper')
      .contains('h1', 'All consent forms (')
      .parent()
      .parent()
      .selectItemPerPage(entry)
    cy.waitLoadingOverlayNotExist()
    this.#itcFetchConsentForm.wait()
  }
  expectToSeeOrgManageConsentPortlet() {
    cy.get('#_orgManageConsentsPortlet_orgManageConsents').should('be.visible')
  }
  verifyTableListConsentForms() {
    cy.cwTable().get('thead th').as('header')
    cy.get('@header').eq(0).should('contain.text', this.#mockUpData.ConsentStatic.formName.label)
    cy.get('@header')
      .eq(1)
      .should('contain.text', this.#mockUpData.ConsentStatic.consentTarget.label)
    cy.get('@header').eq(2).should('contain.text', this.#mockUpData.ConsentStatic.consentType.label)
    cy.get('@header').eq(3).should('contain.text', this.#mockUpData.ConsentStatic.inUse.label)
    cy.get('@header').eq(4).should('contain.text', this.#mockUpData.ConsentStatic.lastChanged.label)
    cy.get('@header').eq(5).should('contain.text', this.#mockUpData.ConsentStatic.status.label)
  }
  verifyThreeDotOfConsentTypeOrganization() {
    cy.cwTable()
      .cwRowName(this.#mockUpData.ExistingConsentForms.welcomeToWebLearnOrganization.name)
      .within(($row) => {
        cy.wrap($row).getThreeDots().click()
        cy.wrap($row).getThreeDots().getDropdownMenu().get('li > a').as('dropdownItems')
        cy.get('@dropdownItems').should('have.length', 2)
        cy.get('@dropdownItems').eq(0).should('contain.text', Field.EDIT)
        cy.get('@dropdownItems').eq(1).should('contain.text', Field.PREVIEW)
        cy.wrap($row).getThreeDots().click()
      })
  }
  verifyThreeDotOfConsentTypeCommunity() {
    this.verifyThreeDotItemsOfConsentType(
      this.#mockUpData.ExistingConsentForms.gladToSeeYouInOurCommunity.name
    )
  }
  verifyThreeDotOfConsentTypeMedical() {
    this.verifyThreeDotItemsOfConsentType(
      this.#mockUpData.ExistingConsentForms.permissionToViewData.name
    )
  }
  verifyThreeDotOfConsentTypeCourse() {
    this.verifyThreeDotItemsOfConsentType(
      this.#mockUpData.ExistingConsentForms.hopeTheCourseIsWhatYouNeed.name
    )
  }
  verifyThreeDotItemsOfConsentType(formName) {
    cy.cwTable()
      .cwRowName(formName)
      .within(($row) => {
        cy.wrap($row).getThreeDots().click()
        cy.wrap($row).getThreeDots().getDropdownMenu().get('li > a').as('dropdownItems')
        cy.get('@dropdownItems').should('have.length', 4)
        cy.get('@dropdownItems').eq(0).should('contain.text', Field.EDIT)
        cy.get('@dropdownItems').eq(1).should('contain.text', Field.PREVIEW)
        cy.get('@dropdownItems').eq(2).should('contain.text', Field.MARK_AD_DEPRECATED)
        cy.get('@dropdownItems').eq(3).should('contain.text', Field.DELETE)
        cy.wrap($row).getThreeDots().click()
      })
  }
  previewConsentTypeOrganization() {
    this.previewConsentByFormName(
      this.#mockUpData.ExistingConsentForms.welcomeToWebLearnOrganization.name
    )
  }
  previewConsentTypeCommunity() {
    this.previewConsentByFormName(
      this.#mockUpData.ExistingConsentForms.gladToSeeYouInOurCommunity.name
    )
  }
  previewConsentTypeMedical() {
    this.previewConsentByFormName(this.#mockUpData.ExistingConsentForms.permissionToViewData.name)
  }
  previewConsentTypeCourse() {
    this.previewConsentByFormName(
      this.#mockUpData.ExistingConsentForms.hopeTheCourseIsWhatYouNeed.name
    )
  }
  previewConsentByFormName(name) {
    WaitUtil.waitAllResourceLoads()
    cy.cwTable()
      .cwRowName(name)
      .within(($row) => {
        cy.wrap($row).getThreeDots().click()
        cy.wrap($row).clickDropdownName(Field.PREVIEW)
      })
    cy.getPopup().should('be.visible').closePopup()
  }

  cleanUpConsentFormByDelete(formName) {
    cy.logInTestCase('Reset Data: Deleting ' + formName)
    this.redirectToOrgManageConsent()
    this.deleteConsentForms(formName)
  }

  redirectToOrgManageConsent() {
    this.#itcFetchConsentForm.set()
    cy.visit(OrgConst.TABS.MANAGE_CONSENTS)
    this.#itcFetchConsentForm.wait()
    cy.waitLoadingOverlayNotExist()
    this.showEntry('75')
  }

  cleanUpConsentFormByDeprecatedAndDelete(formName) {
    cy.logInTestCase('Reset Data: Deleting ' + formName)
    this.redirectToOrgManageConsent()
    this.markConsentAsDeprecatedAndDelete(formName)
  }

  #removeConsentItems(consentItems) {
    Object.entries(consentItems).forEach(([, value]) => {
      cy.getElementWithLabel(value.description, '.consent-items .item').within(($item) =>
        cy.wrap($item).clickDropdownItem(Field.DELETE)
      )
      cy.clickButtonByName(Field.YES_DELETE)
      cy.expectElementWithLabelNotExist(value.description, '.consent-items .item')
    })
  }

  fillCustomForm(form, isEdit) {
    const { formName, description, consentItems, existingMemberMustAgree } = form

    if (isEdit) {
      this.#removeConsentItems(consentItems)
      this.checkExistingMembersMustAgreeToChanges(existingMemberMustAgree)
      cy.clearTextEditor()
    }

    this.enterFormName(formName)
    this.enterFormDescription(description)
    this.addCustomConsentItems(Object.entries(consentItems))
    this.checkExistingMembersMustAgreeToChanges(existingMemberMustAgree)
  }

  createForm(form) {
    this.accessToCreateForm()
    this.enterFormName(form.name.new)
    this.enterFormDescription(form.desc.new)
    this.selectConsentTarget(form.consentTarget)
    this.selectRecurrent(form.recurrence.new)
    this.selectPopupSize(form.formSize.new)
    if (form.consentItems.systemItems) {
      this.addSystemConsent(form.consentItems.systemItems.optional.new)
    }
    this.addCustomConsentItems(Object.entries(form.consentItems.customItems))
    this.checkExistingMembersMustAgreeToChanges(form['existingMemberMustAgree'])
  }
  checkExistingMembersMustAgreeToChanges(existingMemberMustAgree) {
    cy.get('div.consent-form-body')
      .contains('div.input-checkbox-wrapper', 'Existing members must agree to changes.')
      .as('existingMemberMustAgree')
    cy.get('@existingMemberMustAgree').within(() =>
      existingMemberMustAgree ? cy.getCheckbox().check() : cy.getCheckbox().uncheck()
    )
  }
  checkExisting() {
    cy.get('#_orgManageConsentsPortlet_required-version').check()
  }
  uncheckExisting() {
    cy.get('#_orgManageConsentsPortlet_required-version').uncheck()
  }
  clickEditForm(name) {
    this.#itcFetchSettingConsent.set()
    cy.cwTable()
      .cwRowName(name)
      .first()
      .within(($row) => {
        cy.wrap($row).clickDropdownItem(Field.EDIT)
      })
    this.#itcFetchSettingConsent.wait()
  }
  editForm(form) {
    this.clickEditForm(form.name.new)
    this.enterFormName(form.name.edit)
    cy.clearTextEditor()
    this.enterFormDescription(form.desc.edit)
    this.selectRecurrent(form.recurrence.edit)
    this.selectPopupSize(form.formSize.edit)
    if (form.consentItems.systemItems) {
      this.addSystemConsent(form.consentItems.systemItems.optional.edit)
    }
    this.editCustomConsentItems(Object.entries(form.consentItems.customItems))
  }
  save() {
    this.#itcCreateConsentForm.set()
    cy.get('.cec-card__main-content > .d-md-flex').within(($cardHeader) => {
      cy.wrap($cardHeader).get(`button:contains("${Field.SAVE}")`).click()
      this.#itcFetchConsentForm.set()
      this.#itcFetchConsentFormInstance.set()
    })
    this.#itcCreateConsentForm.wait()
    this.#itcFetchConsentForm.wait()
    this.#itcFetchConsentFormInstance.wait()
    cy.waitLoadingOverlayNotExist()
    cy.wait(500)
  }
  expectNewConsentForm(name) {
    cy.cwTable()
      .rowName(name)
      .then(($newForm) => {
        cy.wrap($newForm).should('be.visible').get('.badge-warning').should('contain.text', 'new')
      })
  }
  expectNotSeeNewConsentForm(name) {
    cy.cwTable().should('not.contain.text', name)
  }
  accessToCreateForm() {
    cy.get('button').contains('Create form').click()
  }
  enterFormName(name) {
    this.getFormNameInput().clear().type(`${name}`)
  }
  getFormNameInput() {
    return cy.get('label:contains("Form name")').parents('.input-text-wrapper').find('input')
  }

  enterFormDescription(description) {
    cy.typeInEditor(description)
  }
  selectConsentTarget(name) {
    cy.get('a')
      .contains('Consent target')
      .parents('li')
      .find('#_orgManageConsentsPortlet_cw-dropdown_')
      .click()
    cy.get('.dropdown-item').contains(name).click()
  }
  selectRecurrent(recurrent) {
    if (recurrent.isRecurrence) {
      cy.get('a')
        .contains('Recurrence')
        .parents('li')
        .find('#_orgManageConsentsPortlet_cw-dropdown_')
        .click()
      cy.get('.dropdown-item').contains(recurrent.every).click()
    } else {
      cy.get('#_orgManageConsentsPortlet_recurrence').click()
    }
  }
  selectPopupSize(size) {
    cy.get('a').contains('Form size').parents('li').find('div').contains(size).click()
  }
  addSystemConsent(optional) {
    this.#itcFetchConsentItem.set()
    this.addConsentItem()
    this.#itcFetchConsentItem.wait()
    cy.get('label')
      .contains(Field.TYPE)
      .parents('.form-group')
      .find('#_orgManageConsentsPortlet_cw-dropdown_')
      .click()
    cy.get('.dropdown-item').contains('System item').click()
    if (optional) {
      cy.get('#_orgManageConsentsPortlet_optional').click()
    }
    cy.get('button').contains(Field.ADD).click()
  }
  addConsentItem() {
    cy.get('.consent-items-wrapper').contains('Add consent item').click()
  }
  createDefaultConsentForm(form) {
    this.enterFormName(form.name.new)
    this.enterFormDescription(form.desc.new)
    this.addCustomConsentItems(Object.entries(form.consentItems.customItems))
  }
  addCustomConsentItems(customItems) {
    customItems.forEach((item) => {
      this.addConsentItem()
      if (item[1].shortLabel.input)
        this.addCustomConsentItem({
          shortLabel: item[1].shortLabel.input.value.new,
          description: item[1].consentDescription.textEditor.value.new,
          optional: item[1].optional.new,
        })
      else
        this.addCustomConsentItem({
          shortLabel: item[1].shortLabel,
          description: item[1].description,
          optional: item[1].optional,
        })
    })
  }
  editCustomConsentItems(customItems) {
    customItems.forEach((customItem) => {
      cy.get(`.item:contains("${customItem[1].shortLabel.input.value.new}")`).within(($item) => {
        this.#itcFetchConsentItem.set()
        cy.wrap($item).clickDropdownItem(Field.EDIT)
        this.#itcFetchConsentItem.wait()

        this.editCustomConsentItem($item, {
          shortLabel: customItem[1].shortLabel.input.value.edit,
          description: customItem[1].consentDescription.textEditor.value.edit,
          optional: customItem[1].optional.edit,
        })
      })
    })
  }
  editCustomConsentItem(item, modifyItem = {}) {
    cy.wrap(item)
      .swal2()
      .within(($popup) => {
        cy.wrap($popup)
          .get('label:contains("Short label")')
          .parents('.form-group')
          .find('input')
          .clear()
          .type(modifyItem.shortLabel)
        cy.wrap($popup).clearTextEditor()
        cy.wrap($popup).typeInEditor(modifyItem.description)
        if (modifyItem.optional) {
          cy.wrap($popup).get('#_orgManageConsentsPortlet_optional').click()
        }
        cy.wrap($popup).get(`button:contains("${Field.SAVE}")`).click()
      })
  }
  addCustomConsentItem(customItem = {}) {
    cy.swal2().within(($popup) => {
      cy.wrap($popup)
        .get('label:contains("Short label")')
        .parents('.form-group')
        .find('input')
        .type(`${customItem.shortLabel}`)
      cy.wrap($popup).typeInEditor(customItem.description)
      if (customItem.optional) {
        cy.checkboxByLabel('Optional').check()
      }
    })

    cy.get('button').contains(Field.ADD).click()
  }
  preview() {
    cy.get('.cec-card__main-content').find('button').contains(Field.PREVIEW).click()
    cy.getPopup().should('be.visible').closePopup()
  }
  expectDisableSaveButton() {
    cy.get(`button:contains("${Field.SAVE}")`).should('have.attr', 'disabled')
  }
  expectEnableSaveButton() {
    cy.get(`button:contains("${Field.SAVE}")`).should('not.have.attr', 'disabled')
  }
  clearFormName() {
    this.getFormNameInput().clear()
  }
  clearFormDescription() {
    cy.clearTextEditor()
  }
  deleteConsentForm(formName) {
    cy.cwTable()
      .get('tbody')
      .invoke('text')
      .then((text) => {
        if (text.includes(formName)) {
          this.delete(formName)
          this.confirmDelete()
        }
      })
  }
  confirmDelete() {
    this.#itcDeleteConsentForm.set()
    cy.swal2Confirm(Field.YES_DELETE).click()
    this.#itcDeleteConsentForm.wait()
  }
  delete(formName, index = 0) {
    cy.cwTable()
      .cwRowName(formName)
      .eq(index)
      .within(($row) => {
        cy.wait(1000)
        cy.wrap($row).clickDropdownItem(Field.DELETE)
      })
  }
  cleanUpForm(formName) {
    cy.cwTable()
      .get('tbody')
      .invoke('text')
      .then((text) => {
        if (text.includes(formName)) {
          this.markAsDeprecated(formName)
          cy.wait(5000)
          this.delete(formName)
          this.confirmDelete()
        }
      })
  }

  #baseInvokeConsentEntry($element, $index, callback = () => {}) {
    cy.wrap($element).within(($row) => {
      cy.wrap($row)
        .get('td')
        .eq($index)
        .invoke('text')
        .then(($text) => {
          callback($text)
        })
    })
  }

  #isConsentFormUsed($element) {
    cy.wrap(false).as('hasUsed')
    this.#baseInvokeConsentEntry($element, 3, ($text) => {
      if ($text.trim() !== Field.DASH.concat(Field.DASH)) {
        cy.wrap(true).as('hasUsed')
      }
    })
    return cy.get('@hasUsed')
  }

  #invokeConsentFormStatus($element) {
    cy.wrap(false).as('isActive')
    this.#baseInvokeConsentEntry($element, 5, ($text) => {
      if ($text.includes('Active')) {
        cy.wrap(true).as('isActive')
      }
    })
    return cy.get('@isActive')
  }

  #markConsentAsDeprecatedAndDelete(formName, $element) {
    this.#invokeConsentFormStatus($element).then((isActive) => {
      if (isActive) {
        cy.wrap($element).within(($row) => {
          cy.wrap($row).clickDropdownItem(Field.MARK_AD_DEPRECATED)
        })
        this.confirmDeprecate()
      }
      this.#isConsentFormUsed($element).then((hasUsed) => {
        if (!hasUsed) {
          this.deleteConsentForm(formName)
        }
      })
    })
  }

  #hasConsentForm(formName) {
    cy.wrap(false).as('hasConsentForm')
    cy.cwTable().within(($table) => {
      if ($table.find(`tbody tr td:contains("${formName}")`).length) {
        cy.wrap(true).as('hasConsentForm')
      }
    })
    return cy.get('@hasConsentForm')
  }

  #baseAvailableConsentForms(formName, callback = () => {}) {
    this.#hasConsentForm(formName).then((hasConsentForm) => {
      if (hasConsentForm) {
        cy.get('@cwTable')
          .rowName(formName)
          .then(($elements) => {
            if ($elements.length) {
              cy.wrap($elements).each(($element, $index) => {
                callback($element, $index)
              })
            }
          })
      }
    })
  }

  deleteConsentForms(formName) {
    this.#baseAvailableConsentForms(formName, ($element) => {
      this.#isConsentFormUsed($element).then((hasUsed) => {
        if (!hasUsed) {
          this.deleteConsentForm(formName)
        }
      })
    })
  }

  markConsentAsDeprecatedAndDelete(formName) {
    cy.cwTable().then(($table) => {
      const total = $table.find(`tbody tr td:contains("${formName}")`).length
      for (let i = 0; i < total; i++) {
        cy.wrap($table)
          .get(`tbody tr td:contains("${formName}")`)
          .last()
          .parent()
          .then(($consentItem) => {
            this.#markConsentAsDeprecatedAndDelete(formName, $consentItem)
          })
      }
    })
  }

  markConsentFormsAsDeprecated(formName) {
    this.#baseAvailableConsentForms(formName, () => {
      this.markAsDeprecated(formName)
    })
  }

  markAsDeprecated(formName) {
    cy.cwTable()
      .cwRowName(formName)
      .first()
      .within(($row) => {
        cy.wrap($row).clickDropdownItem(Field.MARK_AD_DEPRECATED)
      })
    this.confirmDeprecate()
  }
  confirmDeprecate() {
    this.#itcFetchConsentForm.set()
    this.#itcDeprecateConsentForm.set()
    cy.swal2Confirm(Field.YES_DEPRECATE).click()
    this.#itcFetchConsentForm.wait()
    this.#itcDeprecateConsentForm.wait()
  }
  previewConsentForm(formName) {
    cy.cwTable()
      .cwRowName(formName)
      .within(($row) => {
        cy.wrap($row).clickDropdownItem(Field.PREVIEW)
      })
  }
  expectPreviewPopUp() {
    cy.getPopup().should('be.visible').closePopup()
  }
  expectPreviewPopUpUpdated(form) {
    cy.getPopup()
      .within(($popup) => {
        cy.wrap($popup)
          .getPopupBody()
          .within(($body) => {
            cy.wrap($body)
              .get('.text-black.font-weight-bold')
              .should('contain.text', form.name.edit)
            cy.wrap($body).get('p').should('contain.text', form.desc.edit)
            const customItems = Object.entries(form.consentItems.customItems)
            for (let i = 0; i < customItems.length; i++) {
              cy.wrap($body)
                .get('.form-group.input-checkbox-wrapper')
                .find('p')
                .eq(i)
                .should('contain.text', customItems[i][1].shortLabel.input.value.edit)
            }
          })
      })
      .closePopup()
  }
  expectPopUpInfoFormCannotDelete() {
    cy.swal2().within(($swal2) => {
      cy.getSwal2Header().should('have.text', 'Form cannot be deleted')
      cy.wrap($swal2)
        .getSwal2Content()
        .within(($swal2Content) => {
          cy.wrap($swal2Content)
            .find('div')
            .should(
              'contain.text',
              'This form is currently in use or has historic consent entries linked to it. It can be marked as deprecated instead to prevent future usage.'
            )
        })
    })
  }
  expectDisableMarkAsDeprecated(formName) {
    WaitUtil.waitAllResourceLoads()
    cy.cwTable()
      .cwRowName(formName)
      .within(($row) => {
        cy.wrap($row).getThreeDots().click()
        cy.wrap($row)
          .getThreeDots()
          .getDropdownMenu()
          .contains(Field.MARK_AD_DEPRECATED)
          .should('have.attr', 'disabled')
        cy.wrap($row).getThreeDots().click()
      })
  }
  expectConsentTypeCanNotChange() {
    cy.get('li:contains("Consent type")')
      .find('#_orgManageConsentsPortlet_cw-dropdown_')
      .should('have.class', 'disabled')
  }
  expectConsentTargetCanNotChange() {
    cy.get('li:contains("Consent target")')
      .find('#_orgManageConsentsPortlet_cw-dropdown_')
      .should('have.class', 'disabled')
  }
  enableOrDisableOrgConsent(toggleLabel) {
    cy.cecCard().cardMainContent().as('OrgConsentMainContent')
    cy.get('@OrgConsentMainContent').within(() => {
      cy.contains('div.manage-consent', 'Organization Consent Form')
        .cwToggleButton(toggleLabel)
        .toggleSwitch()
    })
  }
  verifyConfirmDialogOnEnableOrDisableOrgConsent(confirmDialogLabel) {
    cy.get('@OrgConsentMainContent')
      .swal2()
      .within(($confirmDialog) => {
        cy.wrap($confirmDialog)
          .getSwal2Header()
          .contains(`${confirmDialogLabel} organization consent form?`)
          .should('be.visible')
        cy.wrap($confirmDialog).swal2Cancel(Field.CANCEL)
        this.#itcModifyConsentStatus.set()
        cy.wrap($confirmDialog).swal2Confirm(`Yes, ${confirmDialogLabel}`).click()
        this.#itcModifyConsentStatus.wait()
      })
  }

  bookThenExpectSeePredefinedConsent(courseId, instanceName, consentBaseYaml) {
    const booking = new Booking()
    const courseConsentPopupAssertion = new CourseConsentPopupAssertion()

    cy.logInTestCase('Book course then expect see predefined consent')
    booking.setInstanceName(instanceName)
    courseConsentPopupAssertion.setConsent(consentBaseYaml)

    new CourseDetail().visitCourseDetail(courseId)
    booking.bookCourseConsentByName()
    courseConsentPopupAssertion.expectPredefinedConsentPopup()
  }

  resetAndProcessBookCourseConsent(memberEmail, courseYamlStub) {
    const managePeopleInstance = new ManagePeopleInstance()

    const courseId = courseYamlStub.getCourseId()
    const instanceId = courseYamlStub.getInstanceId()
    managePeopleInstance.setCourseAndInstanceId(courseId, instanceId)

    managePeopleInstance.visitThenRemoveInstanceMember(memberEmail)
    this.bookThenExpectSeePredefinedConsent(
      courseId,
      courseYamlStub.getInstanceName(),
      courseYamlStub.getConsentBaseYaml()
    )
  }
}
export default ManageConsent
