import Environment from '../base/Environment'
import SpyOpenWindowEvent from '../base/SpyOpenWindowEvent'
import Field from '../constants/Field'
import MyProfileIntercept from './base/MyProfileIntercept'
import MyProfileLoginStub from './stub/MyProfileLoginStub'
import MyProfileStub from './stub/MyProfileStub'

class MyProfile {
  itc = new MyProfileIntercept()
  constructor() {
    this.stub = new MyProfileStub()
    this.login = new MyProfileLoginStub()
    this.itcGetProfileOptions = this.itc.getProfileOptions
    this.itcFetchViewMode = this.itc.fetchViewMode
    this.itcCheckExternalLink = this.itc.checkExternalLink
    this.itcFetchExpertise = this.itc.fetchExpertise
    this.itcModifiedCommunity = this.itc.modifiedCommunity
    this.itcFetchCommunity = this.itc.fetchCommunity
    this.itcGetProfileImage = this.itc.getProfileImage
    this.itcModifyCertificate = this.itc.modifyCertificate
    this.itcChangeProfilePicture = this.itc.changeProfilePicture
  }

  _fixturesLocation = 'cypress/fixtures/'
  _myProfileImagePath = 'profile/attachments/my-profile.jpg'
  _myProfileImage1Path = 'profile/attachments/my-profile-1.png'
  _myProfileImage2Path = 'profile/attachments/my-profile-2.jpg'
  _viewUserProfileUrl = '/web/my-profile/profile/-/display/'

  spyOpenWindowEvent = new SpyOpenWindowEvent()
  defaultImage = 'default-profile-avatar.png'

  clickEditContactInfo() {
    cy.get('p:contains("Contact Info") > a').click()
    this.initContactInfo()
  }
  clickEditDetails() {
    cy.get('.view-profile-wrapper').should('exist')
    cy.get('.profile-detail-wrapper')
      .last()
      .within(() => {
        cy.get('div:contains("Details") + div > a').click()
      })
    cy.get('.view-profile-wrapper').should('not.exist')
    cy.get('.edit-profile-section').should('exist')
  }
  initContactInfo() {
    cy.get('.profile .row .row').within(($profile) => {
      cy.wrap($profile).get('.col-12').eq(0).as('givenName')
      cy.get('@givenName').within(() => {
        cy.get('input.form-control.shadow-none').as('givenNameInput')
      })
      cy.wrap($profile).get('.col-12').eq(1).as('familyName')
      cy.get('@familyName').within(() => {
        cy.get('input.form-control.shadow-none').as('familyNameInput')
      })
      cy.wrap($profile).get('.col-12').eq(2).as('screenName')
      cy.get('@screenName').within(() => {
        cy.get('input.form-control.shadow-none').as('screenNameInput')
      })
    })
    cy.get('button:contains("Update Contact info")').as('updateButton')
    cy.get('label:contains("Headline")').parent().as('headline')
  }
  checkWarningMessage(index, message) {
    cy.get('.warning-message')
      .eq(index)
      .within(($warningMessage) => {
        cy.wrap($warningMessage).hasSvgIcon()
        cy.wrap($warningMessage).contains('div.text-dark', message).should('be.visible')
      })
  }
  clickDropdownVisibilityItem(dropdownItemName) {
    cy.get('@dropdownVisibility').within(($dropdown) => {
      cy.wrap($dropdown).clickCwDropdownItem(dropdownItemName)
    })
  }
  checkDropdownItemsEnabled(items = []) {
    cy.get('.visibility-dropdown').within(() => {
      items.forEach((item) => {
        this.getDropdownItemByLabel(item)
          .should('not.have.class', 'disabled')
          .and('not.have.attr', 'disabled')
      })
    })
  }
  checkDropdownItemsDisabled(items = []) {
    cy.get('.visibility-dropdown').within(() => {
      items.forEach((item) => {
        this.getDropdownItemByLabel(item)
          .should('have.class', 'disabled')
          .and('have.attr', 'disabled')
      })
    })
  }
  getDropdownItemByLabel(item) {
    return cy.get(`a > label > span:contains('${item}')`).parents('li')
  }
  getSelectType(subject) {
    return cy
      .wrap(subject)
      .get('.visibility-dropdown-wrapper .address-type')
      .as('dropdownVisibility')
  }
  getSelectVisibility(subject) {
    return cy
      .wrap(subject)
      .get('.visibility-dropdown-wrapper .visibility-dropdown')
      .as('dropdownVisibility')
  }
  clickSiblingDropdownVisibility(dropdownName = 'Platform') {
    cy.get('@dropdownVisibility').within(($dropdownWrapper) => {
      cy.wrap($dropdownWrapper).within(($dropdown) => {
        cy.wrap($dropdown).click()
        cy.wrap($dropdown).clickDropdownName(dropdownName)
      })
    })
  }
  redirectSpyUrl() {
    new SpyOpenWindowEvent().getUrl().then(($url) => {
      this.itcGetProfileOptions.set()
      cy.visit($url)
      this.itcGetProfileOptions.wait()
    })
  }
  clickExpertiseAndQualificationTab(requireInitElements = true) {
    cy.get('.e-toolbar-items')
      .contains('.e-text-wrap > .e-tab-text', 'Expertise & Qualifications')
      .click()
      .wait(3000)
    if (requireInitElements) {
      this.initExpertiseAndQualificationsElements()
    }
  }
  initExpertiseAndQualificationsElements() {
    cy.get('.expertise-wrapper .col-sm-12').then(($expertise) => {
      cy.wrap($expertise).eq(0).as('areaOfFocus')
      cy.wrap($expertise).eq(1).as('skillsAndExpertise')
      cy.wrap($expertise).eq(2).as('languages')
      cy.wrap($expertise).eq(3).as('interestsAndHobbies')
    })
  }
  open(path, role) {
    cy.visitThenSignIn(path, role)
  }
  clickPreviewAs(dropdownItem) {
    this.spyOpenWindowEvent.setSpy()
    cy.getCwSplitDropdown()
      .eq(1)
      .within(($splitDropdown) => {
        cy.wrap($splitDropdown).get('.dropdown-toggle').click()
        cy.wrap($splitDropdown).clickDropdownName(dropdownItem)
      })
    this.redirectSpyUrl()
  }
  previewProfileAsAnyLoggedInUser() {
    this.clickPreviewAs('Any logged-in user')
  }
  previewProfileAsConnections() {
    this.clickPreviewAs('Someone connected to me')
  }
  previewProfileAsOrganization() {
    this.clickPreviewAs('Someone in my organization')
  }
  visitMyProfile() {
    this.itcGetProfileOptions.set()
    cy.visit('/web/my-profile/profile')
    this.itcGetProfileOptions.wait()
  }
  clickDeleteProfileImage() {
    cy.swal2().within(() => {
      cy.get('span:contains("Delete image")').parent().click()
    })
  }
  clickChangeProfileImage() {
    cy.get('button:contains("Change image")').click()
  }
  selectFileUpload(path) {
    this.clickChangeProfileImage()
    cy.get('input[type="file"].hide').selectFile(this._fixturesLocation + path, { force: true })
  }
  openPopupMyFocus() {
    cy.get('span:contains("My Focus")')
      .parents('.d-flex.py-3')
      .within(() => {
        cy.get('div.icon-wrapper').click()
      })
  }
  expectShowEmptyState(screenName) {
    const emptyStateContent =
      screenName + ' ' + 'must be busy right now! Check in again soon for the updated information.'
    cy.contains('p', emptyStateContent).as('emptyStateLabel').should('be.visible')
    cy.get('@emptyStateLabel')
      .parent()
      .within(() => {
        cy.get('figure.image__wrapper > img')
          .should('be.visible')
          .invoke('attr', 'src')
          .then(($src) => {
            expect($src).to.contain('/o/cw-cec-theme/images/empty-profile.png')
          })
      })
  }
  addItemsToMyFocus(items = [], field = 'Area of Focus', isRequiredSave = false) {
    cy.getPopup().within(($popup) => {
      cy.get('.expertise-wrapper').within(($expertise) => {
        cy.wrap($expertise)
          .contains('h4', field)
          .siblings('.visibility-dropdown-wrapper')
          .within(() => {
            items.forEach((item) => {
              cy.get('.multiselect__input').type(`${item}`, { force: true })
              cy.wait(1000)
              cy.get('.multiselect__input').type(`{enter}`, { force: true })
            })
          })
      })
      cy.wrap($popup).as('popup')
    })
    if (isRequiredSave) {
      this.clickSaveMyFocusPopup()
    }
  }
  clickSaveMyFocusPopup() {
    cy.getPopup().within(($popup) => {
      if (!!$popup.find('button.btn-primary').not('[disabled="disabled"]').length) {
        this.itcFetchExpertise.set()
        cy.wrap($popup).contains('button', Field.SAVE).click()
        this.itcFetchExpertise.wait()
      } else {
        this.closeMyFocusPopup()
      }
    })
  }
  removeAllMyFocusItemsBy(field = 'Area of Focus') {
    cy.getPopup().within(($popup) => {
      cy.get('.expertise-wrapper').within(($expertise) => {
        cy.wrap($expertise)
          .contains('h4', field)
          .parent()
          .within(($area) => {
            if ($area.find('ul.list-inline').length) {
              cy.get('ul.list-inline').within(($list) => {
                const totalItems = $list.find(`li.list-inline-item`).length
                if (totalItems) {
                  for (let i = 0; i < totalItems; i++) {
                    cy.get(`li.list-inline-item`)
                      .last()
                      .within(() => {
                        cy.get('a').click()
                      })
                  }
                }
              })
            }
          })
      })
      cy.wrap($popup).as('popup')
    })

    return cy.get('@popup')
  }
  removeMyFocusItems(items = [], field = 'Area of Focus') {
    cy.getPopup().within(($popup) => {
      cy.get('.expertise-wrapper').within(($expertise) => {
        cy.wrap($expertise)
          .contains('h4', field)
          .parent()
          .within(($area) => {
            if ($area.find('ul.list-inline').length) {
              items.forEach((item) => {
                cy.get('ul.list-inline').within(($list) => {
                  if (!!$list.find(`li span:contains('${item}')`).length) {
                    cy.contains('li span.label', item).within(($item) => {
                      cy.wrap($item).get('a').click()
                    })
                  }
                })
              })
            }
          })
      })
      cy.wrap($popup).as('popup')
    })

    return cy.get('@popup')
  }
  closeMyFocusPopup() {
    cy.get('@popup').closePopup()
  }
  clickCommunityTab() {
    cy.get('.e-toolbar-items')
      .first()
      .within(($toolbar) => {
        cy.wrap($toolbar).contains('.e-text-wrap > .e-tab-text', 'Community').click()
      })
  }
  visitCwDashboard() {
    cy.visit('/u/home/dashboard')
  }
  expectedShowProfileUsernameInDashboard(name) {
    cy.contains('.cec-card.card-custom', name).should('be.visible')
  }
  expectedShowProfileHeadline(content) {
    cy.contains('.cec-card.card-custom p', content).should('be.visible')
  }
  expectedPreviewProfileAsFallbackToEN(menuData) {
    cy.getCwSplitDropdown()
      .eq(1)
      .within(($splitDropdown) => {
        const $menuKeys = Cypress._.keys(menuData)
        Cypress._.each($menuKeys, (key) => {
          cy.wrap($splitDropdown).should('contain', menuData[key])
        })
      })
  }
  getUserUuidByEnvironment(uuid) {
    return uuid[new Environment().getEnvPrefix()]
  }
  getProfileUrl(uuid) {
    return this._viewUserProfileUrl + this.getUserUuidByEnvironment(uuid)
  }
  visitOtherUserProfileUrl(uuid) {
    this.itcFetchViewMode.set()
    cy.visit(this.getProfileUrl(uuid))
    this.itcFetchViewMode.wait()
  }
  clickConnectButton() {
    cy.clickButtonByName('Connect')
  }
  clickMessageButton() {
    cy.clickButtonByName('Message')
    cy.wait(6000)
  }
  clickIconEditCertificate() {
    cy.get('span:contains("Certificates")')
      .parent()
      .siblings('.icon-wrapper')
      .within(() => {
        cy.get('svg.cursor-pointer').click()
      })
  }
}

export default MyProfile
