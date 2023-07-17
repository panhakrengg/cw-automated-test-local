import InterceptReq from '../../../base/InterceptReq'
import { DefaultAdminSettings } from '../../../constants/cop/AdministrationSettings'
class AdminSettings {
  constructor(url) {
    this._url = url
    this._userFullName = ''
    this._copName = ''
  }
  setUrl(url) {
    this._url = url
  }
  getUrl() {
    return this._url
  }
  setUserFullName(fullName) {
    this._userFullName = fullName
  }
  getUserFullName() {
    return this._userFullName
  }
  setCopName(copName) {
    this._copName = copName
  }
  getCopName() {
    return this._copName
  }
  getAdminSettingPageUrl() {
    return this.getUrl() + '#_copMemberManagementPortlet_option=settings'
  }
  #itcFetchAdminSettings = new InterceptReq('/admin/fetch_settings', 'fetchAdminSettings')
  #itcEditAdminSettings = new InterceptReq('/admin/edit_settings', 'editAdminSettings')

  visitAdminSettingsPage(fetchAdminSettings = true) {
    if (fetchAdminSettings) this.#itcFetchAdminSettings.set()
    cy.visit(this.getAdminSettingPageUrl(), { failOnStatusCode: false })
    if (fetchAdminSettings) this.#itcFetchAdminSettings.wait()
  }

  #getSidebar() {
    return cy.cecCard().cardLeftContent().find('.scroll-content')
  }

  #clickSidebar(title) {
    this.#getSidebar().within(() => cy.clickLinkByName(title))
  }

  #getSettingOptionCard(title, callback = () => {}) {
    cy.logInTestCase(`Able to see ${title}`)
    this.#clickSidebar(title)
    cy.cecCard()
      .cardRightContent()
      .within(($right) => {
        cy.getElementWithLabel(title, '.font-size-22')
        cy.cecCardBody().within(($card) => {
          callback($card)
        })
      })
  }
  expectToSeeCollapsableOptions(settingsOptions) {
    const options = Object.keys(settingsOptions)
    this.#getSidebar().within(() => {
      options.forEach((option) => {
        cy.expectElementWithLabelVisible(settingsOptions[option].title, 'a span')
      })
      cy.get('.bg-hover-gray-lighter-alt6').then(($card) => {
        expect($card.length).to.be.equal(options.length)
      })
    })
  }
  expectToSeeVisibility(visibilityOption) {
    this.#getSettingOptionCard(visibilityOption.title, ($card) => {
      cy.wrap($card).within(() => {
        visibilityOption.items.forEach((item) => {
          cy.expectElementWithLabelVisible(item, 'label')
        })
      })
    })
  }
  expectToSeeDefaultPostAuthor(defaultPostAuthor) {
    this.#getSettingOptionCard(defaultPostAuthor.title, ($card) => {
      cy.wrap($card).within(() => {
        defaultPostAuthor.items.forEach((item) => {
          cy.expectElementWithLabelVisible(item.option, 'span')
          cy.expectElementWithLabelVisible(this[item.optionName](), 'i')
        })
      })
    })
  }
  expectToSeeFeatures(featureOptions) {
    this.#getSettingOptionCard(featureOptions.title, ($card) => {
      cy.wrap($card).within(() => {
        featureOptions.items.forEach((item) => {
          cy.expectElementWithLabelVisible(item, 'label')
        })
      })
    })
  }
  expectToSeeMemberPermission(memberPermissionOptions) {
    this.#getSettingOptionCard(memberPermissionOptions.title, ($card) => {
      cy.wrap($card).within(() => {
        memberPermissionOptions.items.forEach((item) => {
          cy.expectElementWithLabelVisible(item, 'div')
        })
        const $menuItems = cy.getCwDropdown().cwDropdownMenuItems()
        memberPermissionOptions.dropdown.forEach((item) => {
          $menuItems.should('contain.text', item)
        })
      })
    })
  }

  #verifyAddToSlideshowPopupImage(popupImage) {
    cy.clickButtonByName(DefaultAdminSettings.banner.btnUploadImage)
    cy.swal2()
      .within(() => {
        cy.getSwal2Header().should('contains.text', popupImage.title)
        cy.get('.croppie-container').should('be.visible')
        cy.get('.icon-rotate__container').should('be.visible')
        cy.expectElementWithLabelVisible(popupImage.recommendedImage, 'p')
        cy.expectButtonWithLabelAndEnabled(popupImage.btnChangeImage)
        cy.expectButtonWithLabelAndEnabled(popupImage.btnSave)
      })
      .closeSwal2()
  }

  #verifyAddToSlideshowPopupCourse(popupCourse) {
    cy.clickButtonByName(DefaultAdminSettings.banner.btnAddCourse)
    cy.getPopup()
      .within(($popup) => {
        cy.wrap($popup).checkPopupHeader(popupCourse.title)
        cy.getInputFeedback().should('be.visible')
        cy.expectElementWithLabelVisible(popupCourse.noCourseLabel, 'span')
        cy.expectButtonWithLabelAndDisabled(popupCourse.btnAdd)
      })
      .closePopup()
  }

  #expectToSeeBannerEmptyTCoP(bannerOption) {
    const {
      slideshowLabel,
      featureCourseLabel,
      btnUploadImage,
      btnAddCourse,
      btnSave,
      popupImage,
      popupCourse,
    } = bannerOption

    this.#getSettingOptionCard(bannerOption.title, ($card) => {
      cy.wrap($card).within(() => {
        cy.expectElementWithLabelVisible(slideshowLabel, '.font-weight-bold')
        cy.expectElementWithLabelVisible(featureCourseLabel, '.text-gray')
        cy.expectButtonWithLabelAndEnabled(btnAddCourse)
        cy.expectButtonWithLabelAndEnabled(btnUploadImage)
        cy.expectButtonWithLabelAndDisabled(btnSave)
      })
    })

    this.#verifyAddToSlideshowPopupImage(popupImage)
    this.#verifyAddToSlideshowPopupCourse(popupCourse)
  }

  #expectToSeeBannerEmptyNotTCoP(bannerOption) {
    const { slideshowLabel, addBannerImage, btnUploadImage, btnAddCourse, btnSave, popupImage } =
      bannerOption

    this.#getSettingOptionCard(bannerOption.title, ($card) => {
      cy.wrap($card).within(() => {
        cy.expectElementWithLabelVisible(slideshowLabel, '.font-weight-bold')
        cy.expectElementWithLabelVisible(addBannerImage, '.text-gray')
        cy.expectButtonWithLabelAndNotExist(btnAddCourse)
        cy.expectButtonWithLabelAndEnabled(btnUploadImage)
        cy.expectButtonWithLabelAndDisabled(btnSave)
      })
    })

    this.#verifyAddToSlideshowPopupImage(popupImage)
  }

  expectToSeeBannerEmpty(bannerOption, isTCoP = false) {
    isTCoP
      ? this.#expectToSeeBannerEmptyTCoP(bannerOption)
      : this.#expectToSeeBannerEmptyNotTCoP(bannerOption)
  }
  expectToSeeOwnership(ownershipOptions) {
    this.#getSettingOptionCard(ownershipOptions.title, ($card) => {
      cy.wrap($card).within(($content) => {
        ownershipOptions.items.forEach((item) => {
          cy.expectElementWithLabelVisible(item.option, 'span')
          cy.expectElementWithLabelVisible(this[item.optionName](), 'span')
        })
        cy.getElementWithLabel('Change Owner', 'a').click()
        cy.wrap($content)
          .swal2()
          .within(() => {
            cy.getSwal2Header().should('contain.text', ownershipOptions.popup.header)
            cy.getSwal2Content().should('contain.text', ownershipOptions.popup.content.toString())
          })
          .closeSwal2()
      })
    })
  }
  expectToSeeDeletion(deletionOptions) {
    this.#getSettingOptionCard(deletionOptions.title, ($card) => {
      cy.wrap($card).within(($content) => {
        deletionOptions.items.forEach((item) => {
          cy.get('div').should('contain.text', item)
          cy.expectElementWithLabelVisible(item, 'div')
        })
        cy.getElementWithLabel(deletionOptions.btnTitle, 'button').click()
        cy.wrap($content)
          .swal2()
          .within(() => {
            cy.getSwal2Header().should('contain.text', deletionOptions.popup.header)
            deletionOptions.popup.content.forEach((item) => {
              cy.expectElementWithLabelVisible(item, 'label')
            })
          })
          .closeSwal2()
      })
    })
  }
  expectToSeePageNotFound() {
    cy.pageNotFound()
  }

  saveVisibility(option) {
    this.#itcEditAdminSettings.set()
    this.#getSettingOptionCard(DefaultAdminSettings.visibility.title, ($card) => {
      cy.wrap($card).within(() => {
        cy.getElementWithLabel(option, 'label').click()
      })
    })
    this.#itcEditAdminSettings.wait()
  }

  #resetToVisibility(option) {
    cy.wait(2000)
    cy.getElementWithLabel(option, 'label')
      .isInputChecked()
      .then((checked) => {
        if (!checked) this.saveVisibility(option)
      })
  }

  resetToUnlisted() {
    this.#resetToVisibility('Unlisted')
  }

  resetToStandard() {
    this.#resetToVisibility('Standard')
  }

  expectSettingsHaveBeenSaved() {
    cy.expectToastMessage('Settings have been saved.')
  }
}
export default AdminSettings
