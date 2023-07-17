import InterceptReq from '../base/InterceptReq'
import QuickTip from '../components/QuickTip'
import MyProfile from './MyProfile'

class Details extends MyProfile {
  quickTip = new QuickTip()

  itcUpdateDetails = new InterceptReq('/profile/edit/contact_detail', 'UpdateDetails')
  elDetailSection = '.details-section'
  visibilitySelector = {
    knownAs: `${this.elDetailSection} .row.cec-pt-4 .col-lg-6:nth-child(1) .visibility-dropdown-wrapper`,
    gender: `${this.elDetailSection} .row.cec-pt-4 .col-lg-6:nth-child(2) .visibility-dropdown-wrapper`,
    dob: `${this.elDetailSection} > .row.mt-3`,
    currentJob: `.current-job-section .row.cec-mt-4 .col-lg-6:nth-child(1)`,
    jobTitle: `.current-job-section .row.cec-mt-4 .col-lg-6:nth-child(2)`,
    webSite: `.website-section .row .col-lg-3`,
    socialMedia: `.social-section .social-media-wrapper .visibility-dropdown-wrapper`,
    position: `.current-job-section .row.mt-3`,
  }
  clickAddAnotherWebsite() {
    cy.get('span:contains("Add another website")').parent().click()
  }
  clickAddAnotherSocialMedia() {
    cy.get('span:contains("Add another social account")').parent().click()
  }
  clickButtonUpdateMyProfile() {
    this.itcUpdateDetails.set()
    cy.clickButtonByName('Update my profile', 2)
    this.itcUpdateDetails.wait()
  }
  expectedShowSuccessUpdateToast() {
    cy.expectToastMessage('Your profile details has been updated.')
  }
  clickLinkBackToMyProfile() {
    cy.clickBackLink()
  }
  checkVisibilityWarningMessage(warningMessage) {
    this.checkWarningMessage(0, warningMessage)
  }
  checkVisibilityNoteMessage(noteMessage) {
    this.checkWarningMessage(1, noteMessage)
  }
  checkKnowAsFreemiumVisibility() {
    cy.get(this.visibilitySelector.knownAs).as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickSiblingDropdownVisibility('Only Me')
      this.checkDropdownItemsEnabled(['Network'])
      this.checkDropdownItemsDisabled(['Only Me', 'Connections', 'Organization', 'Platform'])
    })
  }
  checkGenderFreemiumVisibility() {
    cy.get(this.visibilitySelector.gender).as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickSiblingDropdownVisibility('Connections')
      this.checkDropdownItemsEnabled(['Network'])
      this.checkDropdownItemsDisabled(['Only Me', 'Connections', 'Organization', 'Platform'])
    })
  }
  checkDOBFreemiumVisibility() {
    cy.get(this.visibilitySelector.dob).as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickDropdownVisibilityItem('Organization')
      this.checkDropdownItemsEnabled(['Network'])
      this.checkDropdownItemsDisabled(['Only Me', 'Connections', 'Organization', 'Platform'])
    })
  }
  checkCompanyFreemiumVisibility() {
    cy.get(this.visibilitySelector.currentJob).as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickDropdownVisibilityItem('Organization')
      this.expectMenuItemsStateUnChange()
    })
  }
  checkJobTitleFreemiumVisibility() {
    cy.get(this.visibilitySelector.jobTitle).as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickDropdownVisibilityItem('Platform')
      this.expectMenuItemsStateUnChange()
    })
  }
  expectMenuItemsStateUnChange() {
    this.checkDropdownItemsEnabled(['Network'])
    this.checkDropdownItemsDisabled(['Only Me', 'Connections', 'Organization', 'Platform'])
  }
  checkPositionFreemiumVisibility() {
    cy.get(this.visibilitySelector.position).as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickDropdownVisibilityItem('Platform')
      this.expectMenuItemsStateUnChange()
    })
  }
  checkWebsiteFreemiumVisibility(rowNumberOf = 0) {
    cy.get(this.visibilitySelector.webSite).eq(rowNumberOf).as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickDropdownVisibilityItem('Platform')
      this.checkDropdownItemsEnabled(['Network'])
      this.expectMenuItemsStateUnChange()
    })
  }
  checkSocialMediaFreemiumVisibility(rowNumberOf = 0) {
    cy.get(this.visibilitySelector.socialMedia).eq(rowNumberOf).as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickDropdownVisibilityItem('Platform')
      this.expectMenuItemsStateUnChange()
    })
  }
  verifyDetailsFreemiumVisibility() {
    let secondRowSocialMedia,
      secondRowWebSite = 1

    this.checkKnowAsFreemiumVisibility()
    this.checkGenderFreemiumVisibility()
    this.checkDOBFreemiumVisibility()
    this.checkCompanyFreemiumVisibility()
    this.checkJobTitleFreemiumVisibility()
    this.checkPositionFreemiumVisibility()
    this.checkWebsiteFreemiumVisibility()
    this.clickAddAnotherWebsite()
    this.checkWebsiteFreemiumVisibility(secondRowSocialMedia)
    this.checkSocialMediaFreemiumVisibility()
    this.clickAddAnotherSocialMedia()
    this.checkSocialMediaFreemiumVisibility(secondRowWebSite)
  }
  expectedShowRequiredErrorMessageForBirthday() {
    cy.get('input[placeholder="Select Date"]').clear().blur()
    cy.getValidationError('This field is required.')
  }
  updateDetailsSection(details) {
    cy.get('.details-section').within(() => {
      cy.inputByPlaceholder('Known As', details.knownAs)
      cy.inputByPlaceholder('Select Date', details.birthday.edit)
      cy.get('label:contains("Gender")')
        .parent()
        .within(() => {
          cy.getCwDropdown().then(($dropdown) => {
            cy.wrap($dropdown).click()
            cy.wrap($dropdown).clickDropdownName(details.gender)
          })
        })
    })
  }
  verifyQuickTip(quickTip) {
    this.quickTip.title(quickTip.title)
    this.quickTip.desc(quickTip.list[0])
    this.quickTip.desc(quickTip.list[1])
    this.quickTip.hasMoreTipsLink()
  }
  addCurrentJob(title, placeholder, value) {
    cy.getElementWithLabel(title, 'label')
      .parent()
      .within(($currentJob) => {
        cy.wrap($currentJob)
          .get(`input[placeholder="${placeholder}"]`)
          .type(value, { force: true })
          .wait(2000)
          .type(`{enter}`)
      })
  }
  clickDropdownItem(name) {
    cy.getCwDropdown().then(($dropdown) => {
      cy.wrap($dropdown).click()
      cy.wrap($dropdown).clickDropdownName(name)
    })
  }
  updateCompany(details) {
    cy.inputByPlaceholder('Company/Org', details.company)
  }
  updateVisibilityBy(label, visibility) {
    cy.getElementWithLabel(label)
      .parents('.col-md-7')
      .siblings('.col-md-5')
      .within(() => {
        this.clickDropdownItem(visibility)
      })
  }
  addPosition(details) {
    cy.get('.current-job-section').within(() => {
      this.addCurrentJob('Position', 'Select Position', details.position[0])
    })
  }
  addJobTitle(details) {
    cy.get('.current-job-section').within(() => {
      this.addCurrentJob('Job Title', 'Select Job Title', details.jobTitle[0])
    })
  }
  removeAllSelectedDropdownItemsBy(label) {
    const itemSelector = 'li.list-inline-item'
    cy.getElementWithLabel(label)
      .parents('.col-md-7')
      .within(($position) => {
        const total = $position.find(itemSelector).length
        for (let i = 0; i < total; i++) {
          cy.get(itemSelector)
            .last()
            .within(($item) => {
              if ($item.find('span:contains("Do Not Delete")').length) return
              cy.get('a').click()
            })
        }
      })
  }
  removeAllPositions() {
    this.removeAllSelectedDropdownItemsBy('Position')
  }
  removeAllJobTitles() {
    this.removeAllSelectedDropdownItemsBy('Job Title')
  }
  updateWebsiteSection(websites = []) {
    websites.forEach((website, index) => {
      this.updateWebsiteItem(index, website)
    })
  }
  updateWebsiteItem(index, websiteUrl, protocol = 'https://', visibility = `Platform`) {
    cy.get('.website-section .row.no-gutters')
      .eq(index)
      .within(() => {
        cy.get('.input-group-prepend > button').click()
        cy.get(`.input-group-prepend > .dropdown-menu > a:contains("${protocol}")`)
          .should('be.visible')
          .click()
        this.expectedShowInvalidUrlMessage()
        cy.inputByPlaceholder('Enter your url here', websiteUrl)
        cy.getCwDropdown().then(($dropdown) => {
          cy.wrap($dropdown).click()
          cy.wrap($dropdown).clickDropdownName(visibility)
        })
      })
  }
  expectedShowInvalidUrlMessage() {
    cy.getValidationError('Please enter a valid URL')
  }
  updateSocialMediaItem(index, socialMedia) {
    cy.get('.social-media-wrapper')
      .eq(index)
      .within(() => {
        cy.get('.form-group > .dropdown').then(($dropdown) => {
          cy.wrap($dropdown).get('button.dropdown-toggle').click()
          cy.wrap($dropdown).get(`a:contains("${socialMedia.type}")`).click()
        })
        cy.inputByPlaceholder('Enter your url here', socialMedia.url)
        cy.getCwDropdown().then(($dropdown) => {
          cy.wrap($dropdown).click()
          cy.wrap($dropdown).clickDropdownName(socialMedia.visibility)
        })
      })
  }
  updateSocialMediaSection(socialMedias) {
    this.updateSocialMediaItem(0, socialMedias.facebook)
    this.updateSocialMediaItem(1, socialMedias.linkedIn)
    this.updateSocialMediaItem(2, socialMedias.twitter)
    this.updateSocialMediaItem(3, socialMedias.instagram)
    this.updateSocialMediaItem(4, socialMedias.facebook2)
  }
  removeAllItems(subject) {
    cy.wrap(subject).within(($wrapper) => {
      const totalItems = $wrapper.find('.row.no-gutters').length
      if (totalItems) {
        for (let i = 0; i < totalItems; i++) {
          cy.get('.row.no-gutters')
            .last()
            .within(($item) => {
              cy.wrap($item).get('a.cursor-pointer').click()
            })
        }
      }
    })
  }
  removeAllWebsites() {
    cy.get('.website-section').within(($website) => {
      this.removeAllItems($website)
    })
  }
  removeAllSocialMedias() {
    cy.get('.social-media-wrapper')
      .parent()
      .within(($socialMedia) => {
        this.removeAllItems($socialMedia)
      })
  }
}

export default Details
