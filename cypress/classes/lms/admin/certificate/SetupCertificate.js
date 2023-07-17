import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import { OrgConst } from '../../../org-management/base-org-management/OrgStub'
import LmsAdminStub from '../setup-data/LmsAdminStub'

class SetupCertificate extends LmsAdminStub {
  isDefaultCertificate = true

  itcFetchInitialCertificate = new InterceptReq(
    '/setting/certificate/fetch_initial',
    'FetchInitialCertificate'
  )
  itcFetchCertificate = new InterceptReq('/setting/certificate/fetch', 'FetchCertificate')
  itcFetchAvailableLanguages = new InterceptReq(
    '/certificate/settings/available_languages/fetch',
    'FetchAvailableLanguages'
  )

  getSettingsUrl() {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/settings`
  }

  clickCertificateNav() {
    this.itcFetchInitialCertificate.set()
    cy.getElementWithLabel('Certificates', '.text-decoration-none').click()
    this.itcFetchInitialCertificate.wait()
  }

  getCertificateCard() {
    const certificateID = this.isDefaultCertificate
      ? '#_settingPortlet_defaultCertificate'
      : '#_settingPortlet_externalCertificate'

    cy.cardRightContent().within(() => {
      cy.get(certificateID).as('certificateCard')
    })
  }

  clickEditCertificate() {
    this.itcFetchCertificate.set()
    this.itcFetchAvailableLanguages.set()

    cy.get('@certificateCard').within(() => {
      cy.clickLinkByName('Edit Certificate')
    })

    this.itcFetchCertificate.wait()
    this.itcFetchAvailableLanguages.wait()
  }

  enableIncludeAuthorized() {
    cy.get('.cec-p-5')
      .invoke('text')
      .then((text) => {
        if (!text.includes('Signature')) {
          cy.getElementWithLabel('Include authorized people', 'span')
            .parent('.text-noselect')
            .find('.cw-toggle-button')
            .click()
        }
      })
  }

  addAuthor(authorYaml, index = 0) {
    cy.inputByPlaceholder('Name', this.certificateObj[authorYaml].name.value, index)
    cy.inputByPlaceholder('Position', this.certificateObj[authorYaml].position.value, index)
  }

  clickAddAnotherPerson() {
    cy.get('.cec-p-5')
      .invoke('text')
      .then((text) => {
        if (text.includes('Add another person')) {
          cy.clickLinkByName('Add another person')
        }
      })
  }

  addFirstAuthor() {
    const firstAuthor = this.isDefaultCertificate ? 'authorEmery' : 'authorKristy'
    this.addAuthor(firstAuthor, 0)
  }

  addSecondAuthor() {
    const secondAuthor = this.isDefaultCertificate ? 'authorBritney' : 'authorKendall'
    this.addAuthor(secondAuthor, 1)
  }

  fillCertificateContent() {
    cy.inputByPlaceholder('Certificate', this.certificateObj.certificate.value)
    cy.inputByPlaceholder('of completion', this.certificateObj.ofCompletion.value)
    cy.inputByPlaceholder('Is presented to', this.certificateObj.isPresentedTo.value)
    cy.inputByPlaceholder(
      'for successfully completing',
      this.certificateObj.forSuccessfullyCompleting.value
    )
    cy.inputByPlaceholder('Issued on', this.certificateObj.issueOn.value)

    this.enableIncludeAuthorized()
    this.addFirstAuthor()
    this.clickAddAnotherPerson()
    this.addSecondAuthor()
  }
  fillCertificateDesign() {
    cy.getElementWithLabel('Design', 'div.cursor-pointer').click()

    cy.getElementWithLabel('Theme Color', 'label')
      .siblings('.justify-content-between')
      .find('input')
      .clear()
      .type(this.certificateObj.themeColor.value)
  }

  clickSave() {
    cy.getElementWithLabel(Field.SAVE, 'button')
      .invoke('attr', 'disabled')
      .then((disabled) => {
        if (!disabled) {
          cy.clickButtonByName(Field.SAVE)
          cy.expectToastMessage('Certificate has been saved.')
          cy.waitUntilToastDisappear()
        }
      })
  }

  createCertificate(isDefault = true) {
    this.isDefaultCertificate = isDefault
    this.clickCertificateNav()
    this.getCertificateCard()

    this.clickEditCertificate()
    this.fillCertificateContent()
    this.fillCertificateDesign()

    this.clickSave()
  }
}
export default SetupCertificate
