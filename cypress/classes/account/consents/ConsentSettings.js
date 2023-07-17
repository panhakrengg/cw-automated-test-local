import InterceptAction from '../../base/InterceptAction'
import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import { OrgConst } from '../../org-management/base-org-management/OrgStub'
import Consents from './Consent'

class ConsentSettings extends Consents {
  _url = '/web/my-profile/account-settings#_accountSettingPortlet_option=consents'

  _itcFetchConsents = new InterceptReq('/account_settings/user_consents/fetch', 'FetchConsents')
  _itcFetchConsentsForm = new InterceptReq('/consent_form/fetch', 'FetchConsentsForm')
  _itcRevokeConsent = new InterceptAction('/consent_form/revoked', 'RevokeConsent')

  constructor(consent = '') {
    super(consent)
  }

  getUrl() {
    return this._url
  }

  visit() {
    this._itcFetchConsents.set()
    cy.visit(this._url)
    this._itcFetchConsents.wait()
  }
  accessConsentTab(name = 'Communities') {
    cy.cecCard()
      .cardMainContent()
      .within(() => {
        cy.contains('div.tab-menu', name).as('tabMenu')
        cy.get('@tabMenu').click()
        cy.get('@tabMenu').should('have.class', 'tab-active')
      })
  }
  findConsentItemBy(name) {
    return new Promise((resolve) => {
      cy.get('@cardMainContent').then(($consentHolder) => {
        resolve($consentHolder.find(`span:contains("${name}")`).length > 0)
      })
    })
  }
  getConsentItem(name) {
    cy.get('@cardMainContent').within(() => {
      cy.get('div.consent-user-overview-holder > .border-last-child-none')
        .contains('span', name)
        .parents('.justify-content-between')
        .as('consentItem')
    })
    return cy.get('@consentItem')
  }
  verifyConsentItem(name = OrgConst.NAME) {
    this.getConsentItem(name).within(() => {
      cy.get('.text-gray-darker')
        .should('include.text', 'given')
        .and('include.text', 'last changed')
    })
    this.verifyRevokeConsentInfo()
    this.verifyViewConsentPopup()
  }

  verifyConsentItemElement(name, detailItemsLabel, options, isTabNameEqualOtherTab = false) {
    this.getConsentItem(name)
    this.#verifyAvailableThreeDotOptions(options)
    this.#verifyConsentItemDetailLabel(detailItemsLabel)
    this.#verifyConsentItemImage()
    this.#verifyThreeDotAction(isTabNameEqualOtherTab)
  }

  #verifyThreeDotAction(isTabNameEqualOtherTab) {
    this.#clickThreeDotOption(Field.VIEW)
    super.verifyViewConsent()

    if (!isTabNameEqualOtherTab) {
      this.#clickThreeDotOption(Field.EDIT)
      super.verifyEditConsent()
    }

    this.#clickThreeDotOption(Field.REVOKE)
    super.verifyRevokePopup(isTabNameEqualOtherTab)
  }

  verifyViewConsentPopup() {
    cy.get('@consentItem').within(($consent) => {
      cy.wrap($consent).clickDropdownItem(Field.VIEW)
      this.verifyPreviewConsent($consent)
    })
  }
  verifyRevokeConsentInfo() {
    cy.get('@consentItem').within(($consent) => {
      cy.wrap($consent).clickDropdownItem(Field.REVOKE)
      this.verifyRevokeConsent($consent)
    })
  }
  revokeConsent() {
    cy.get('@consentItem').within(($consent) => {
      cy.wrap($consent).clickDropdownItem(Field.REVOKE)
      this._itcRevokeConsent.set()
      this.confirmRevoke($consent)
      this._itcRevokeConsent.wait()
    })
  }

  revokeConsentIfExist(name) {
    cy.get('@cardMainContent').within(($cardMainContent) => {
      if ($cardMainContent.find(`span:contains('${name}')`).length) {
        this.getConsentItem(name)
        this.revokeConsent()
      }
    })
  }

  _shouldAbleToSeeConsentTab(consentTabs) {
    consentTabs.forEach((tab) => {
      this.#shouldAbleToSeeConsentTab(tab)
    })
  }

  #verifyConsentItemImage() {
    cy.get('@consentItem').within(() => {
      cy.get('.rounded-circle')
        .should('be.visible')
        .invoke('attr', 'src')
        .then(($url) => {
          cy.isSuccessResponseImage($url)
        })
    })
  }

  #verifyConsentItemDetailLabel(detailItemsLabel) {
    cy.get('@consentItem').within(() => {
      detailItemsLabel.forEach((itemLabel) => {
        cy.getElementWithLabel(itemLabel.label, '.text-gray-darker i').should('be.visible')
      })
    })
  }

  #shouldAbleToSeeConsentTab(tab) {
    let index = Number(tab.index)
    cy.get('.consents-holder .tab-menu')
      .eq(index)
      .within(() => {
        cy.expectElementWithLabelVisible(tab.name, 'span')
      })
  }

  #verifyAvailableThreeDotOptions(options) {
    cy.get('@consentItem').within(($consent) => {
      options.forEach((option) => {
        cy.wrap($consent).should('contain.text', option).and('be.visible')
      })
    })
  }

  #clickThreeDotOption(option) {
    cy.get('@consentItem').within(($consent) => {
      cy.wrap($consent).clickDropdownItem(option)
    })
  }
  viewConsent() {
    this.#clickThreeDotOption(Field.VIEW)
  }
  editConsent() {
    this.#clickThreeDotOption(Field.EDIT)
  }
  checkConsentItemBy(name) {
    cy.swal2().within(() => {
      cy.getElementWithLabel(name, 'p').parent().siblings('input').check()
    })
  }
  uncheckConsentItemBy(name) {
    cy.swal2().within(() => {
      cy.getElementWithLabel(name, 'p').parent().siblings('input').uncheck()
    })
  }
  clickButtonUpdateConsent() {
    cy.swal2().within(() => {
      cy.clickButtonByName(Field.UPDATE)
    })
  }
  verifyConsentItemIsDisabledAndUncheckedBy(name) {
    cy.swal2().within(() => {
      cy.getElementWithLabel(name, 'p')
        .parents('.popup-consent-form-wrapper')
        .within(() => {
          cy.get('input').isUnchecked()
          cy.get('input').isCheckboxDisabled()
        })
    })
  }
  verifyConsentItemIsDisabledAndCheckedBy(name) {
    cy.swal2().within(() => {
      cy.getElementWithLabel(name, 'p')
        .parents('.popup-consent-form-wrapper')
        .within(() => {
          cy.get('input').isChecked()
          cy.get('input').isCheckboxDisabled()
        })
    })
  }
  clickLinkDownloadReportGivenConsent() {
    cy.get('.consents-holder').within(() => {
      cy.getElementWithLabel(Field.DOWNLOAD, 'span').parents('.cursor-pointer').click()
    })
  }
}
export default ConsentSettings
