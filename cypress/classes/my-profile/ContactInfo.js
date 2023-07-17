import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import EmailMyProfile from '../notification/email/EmailMyProfile'
import EmailHelper from '../utilities/EmailHelper'
import MyProfile from './MyProfile'

class ContactInfo extends MyProfile {
  #updateSuffix = '(Update)'

  emailHelper = new EmailHelper()
  verificationEmailSubject = EmailMyProfile.VERIFICATION_EMAIL_SUBJECT
  greeting = EmailMyProfile.GREETING
  verificationEmailBody = EmailMyProfile.VERIFICATION_EMAIL_Body
  forceToastToHide = true
  itcModifyContactInfo = new InterceptReq('/profile/contact_info/modify', 'ModifyContactInfo')
  clickAddAnotherPhoneNumber() {
    cy.get('a > span:contains("Add another phone number")').click()
  }
  clickAddAnotherAddress() {
    cy.get('a > span:contains("Add another address")').click()
  }
  clickAddAnotherEmail() {
    cy.get('a > span:contains("Add another email")').click()
  }
  checkVisibilityWarningMessage(warningMessage) {
    this.checkWarningMessage(0, warningMessage)
  }
  checkVisibilityNoteMessage(noteMessage) {
    this.checkWarningMessage(1, noteMessage)
  }
  checkGivenNameFreemiumUserVisibility() {
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .visibility-dropdown-wrapper').as(
      'dropdownVisibility'
    )
    cy.get('@dropdownVisibility').within(() => {
      this.clickDropdownVisibilityItem('Only Me')
      this.checkDropdownItemsEnabled(['Network'])
      this.checkDropdownItemsDisabled(['Connections', 'Organization', 'Platform', 'Only Me'])
    })
  }
  checkFamilyFreemiumUserVisibility() {
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .visibility-dropdown-wrapper').as(
      'dropdownVisibility'
    )
    cy.get('@dropdownVisibility').within(() => {
      this.clickDropdownVisibilityItem('Connection')
      this.checkDropdownItemsEnabled(['Network'])
      this.checkDropdownItemsDisabled(['Connections', 'Organization', 'Platform', 'Only Me'])
    })
  }
  checkHeadlineFreemiumUserVisibility() {
    cy.get(':nth-child(4) > .visibility-dropdown-wrapper').as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickDropdownVisibilityItem('Organization')
      this.checkDropdownItemsEnabled(['Network'])
      this.checkDropdownItemsDisabled(['Connections', 'Organization', 'Platform', 'Only Me'])
    })
  }
  checkAccountEmailFreemiumUserVisibility() {
    cy.get(':nth-child(2) > .col-lg-4 > .visibility-dropdown-wrapper').as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickSiblingDropdownVisibility('Network')
      this.checkDropdownItemsEnabled(['Network', 'Only Me'])
      this.checkDropdownItemsDisabled(['Connections', 'Organization', 'Platform'])
    })
  }
  checkPhoneNumberFreemiumUserVisibility(itemIndex = 0) {
    cy.get(':nth-child(4) > .row > .col-lg-4 .dropdown-control')
      .eq(itemIndex)
      .as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickSiblingDropdownVisibility()
      this.checkDropdownItemsEnabled(['Network'])
      this.checkDropdownItemsDisabled(['Connections', 'Organization', 'Platform', 'Only Me'])
    })
  }
  checkCountryFreemiumUserVisibility(itemIndex = 0) {
    cy.get(
      '.col-lg-9 > :nth-child(1) > :nth-child(2) > .visibility-dropdown-wrapper .visibility-dropdown'
    )
      .eq(itemIndex)
      .as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.clickSiblingDropdownVisibility()
    })
    cy.get('.col-lg-9 > :nth-child(1) > :nth-child(2) > .visibility-dropdown-wrapper')
      .eq(itemIndex)
      .as('dropdownVisibility')
    cy.get('@dropdownVisibility').within(() => {
      this.checkDropdownItemsEnabled(['Network'])
      this.checkDropdownItemsDisabled(['Connections', 'Organization', 'Platform', 'Only Me'])
    })
  }
  verifyDisabledVisibilityForFreemiumUser() {
    let secondRowPhoneNumber,
      secondRowOfCountry = 1
    this.checkGivenNameFreemiumUserVisibility()
    this.checkFamilyFreemiumUserVisibility()
    this.checkHeadlineFreemiumUserVisibility()
    this.checkAccountEmailFreemiumUserVisibility()
    this.checkPhoneNumberFreemiumUserVisibility()
    this.clickAddAnotherPhoneNumber()
    this.checkPhoneNumberFreemiumUserVisibility(secondRowPhoneNumber)
    this.checkCountryFreemiumUserVisibility()
    this.clickAddAnotherAddress()
    this.checkCountryFreemiumUserVisibility(secondRowOfCountry)
  }
  removeDisabledFromHtmlForDropdownVisibility() {
    cy.get('.visibility-dropdown')
      .first()
      .within(($dropdown) => {
        cy.wrap($dropdown)
          .find('a > label > span:contains("Platform")')
          .parentsUntil('li.disabled')
          .eq(1)
          .parent()
          .then(($li) => {
            cy.wrap($li).should('have.attr', 'disabled')
            cy.wrap($li).invoke('removeAttr', 'disabled')
            cy.wrap($li).invoke('removeClass', 'disabled')
          })
      })
  }
  verifySelectedDropdownVisibilityItem(dropdownItem) {
    cy.get('.visibility-dropdown').within(() => {
      cy.get(`#_myProfilePortlet_cw-dropdown_ div[title="${dropdownItem}"]`).within(
        ($dropdownToggle) => {
          cy.wrap($dropdownToggle).hasSvgIcon()
          cy.wrap($dropdownToggle).contains('span', dropdownItem).should('be.visible')
        }
      )
    })
  }
  goBackToProfileInfo() {
    cy.get('.cec-card__header > a').click()
  }
  clearProfile() {
    cy.get('@givenNameInput').clear()
    cy.get('@familyNameInput').clear()
    cy.get('@screenNameInput').clear()
  }
  resetGivenFamilyName(contactInfo) {
    cy.get('@givenNameInput')
      .invoke('text')
      .then((givenName) => {
        cy.get('@familyNameInput')
          .invoke('text')
          .then((familyName) => {
            if (givenName.includes(this.#updateSuffix) || familyName.includes(this.#updateSuffix)) {
              this.clearProfile()
              this.updateProfile(contactInfo)
              this.clickUpdateContactInfo()
            }
          })
      })
  }
  updateProfile(contactInfo, isUpdate = false) {
    const updateStatus = isUpdate ? this.#updateSuffix : ''
    const givenName = contactInfo.givenName + updateStatus
    const familyName = contactInfo.familyName + updateStatus
    const screenName = contactInfo.screenName
    const fullName = givenName + ' ' + familyName
    cy.get('@givenNameInput').type(givenName)
    cy.get('@familyNameInput').type(familyName)
    cy.get('@screenNameInput').type(screenName)

    return {
      fullName: fullName,
      profileUserName: screenName + ' ( ' + fullName + ' ) ',
    }
  }
  clickUpdateContactInfoButton() {
    this.itcModifyContactInfo.set()
    cy.get('@updateButton').eq(1).click()
    this.itcModifyContactInfo.wait()
  }
  expectedUpdateButtonDisabled() {
    cy.get('@updateButton').eq(1).should('have.attr', 'disabled')
    cy.get('@updateButton').eq(2).should('have.attr', 'disabled')
  }
  expectedUpdateButtonEnabled() {
    cy.get('@updateButton').eq(1).should('not.have.attr', 'disabled')
    cy.get('@updateButton').eq(2).should('not.have.attr', 'disabled')
  }
  expectedShowSuccessUpdateToast() {
    cy.expectToastMessage('Your profile contact has been updated.', this.forceToastToHide)
  }
  expectedShowSuccessSendVerificationEmailToast() {
    cy.expectToastMessage(
      'Verification email sent. Please check your email inbox.',
      this.forceToastToHide
    )
  }
  updateAboutYourselfHeadline(content) {
    cy.get('@headline').within(($headline) => {
      cy.wrap($headline)
        .get('input.form-control')
        .then(($input) => {
          cy.wrap($input).clear()
          this.clickUpdateContactInfoButton()
          cy.wrap($input).type(content)
          this.clickUpdateContactInfoButton()
        })
    })
  }
  inputContactEmail(email) {
    cy.get('label:contains("Contact Email")')
      .parents('.col-lg-8.form-group')
      .parent()
      .within(($email) => {
        cy.wrap($email).as('email')
        cy.wrap($email).get('input[placeholder="Please enter your email here"]').as('input')
        cy.get('@input').type(email)
      })
  }
  expectedShowVerificationMessage() {
    cy.get('@email')
      .contains('A verification email will be sent to the above email.')
      .should('be.visible')
  }
  expectedShowIncorrectEmailMessage() {
    cy.get('@email')
      .contains('span.text-danger', 'Please enter a correct email.')
      .should('be.visible')
  }
  clickVerifyEmailButton() {
    cy.get('@email').contains('button', 'Verify').click()
  }
  verifyScreenNameToolTip() {
    cy.wait(1000) // wait for tooltip to ready
    cy.get('#profile-tooltip')
      .invoke('removeClass', 'd-none')
      .invoke('css', 'display')
      .then(($display) => {
        expect($display).to.equal('block')
        cy.contains('Your screen name can only be changed every 14 days.').should('be.visible')
      })
    cy.contains('p', 'Your screen name is visible to all logged-in users.')
  }
  inputPhoneNumber(countryName, number) {
    cy.get(':nth-child(4) > :nth-child(5) > .row')
      .last()
      .within(($phoneNumbers) => {
        cy.get($phoneNumbers).as(`phoneNumber`)
        cy.get('.phone-input .dropdown').within(($dropdown) => {
          cy.wrap($dropdown).click()
          cy.wrap($dropdown).contains('li > strong', countryName).click()
        })
        cy.get('.phone-input input[placeholder="Enter your phone number"]')
          .clear()
          .type(number)
          .blur()
      })
  }
  expectedShowInvalidPhoneNumberMessage() {
    cy.get(`@phoneNumber`).within(() => {
      cy.contains('.has-error .text-danger', 'You entered an invalid phone number.').should(
        'be.visible'
      )
    })
  }
  inputScreenName(name) {
    cy.get('@screenNameInput').then(($input) => {
      cy.wrap($input).clear().type(name).blur()
    })
  }
  expectedShowScreenNameErrorMessage(message) {
    cy.get('@screenName').within(() => {
      cy.contains('span.text-danger', message)
    })
  }
  changePreferredEmail(index) {
    cy.get(`.edit-contact-info > :nth-child(4) > :nth-child(${index})`).within(($email) => {
      cy.wrap($email).get('.preferred-radio-wrapper > .cw-radio').click()
    })
  }
  removePhoneNumber(number) {
    cy.getElementWithLabel('Phone Number', 'label').as('phoneNumbers')
    cy.get('@phoneNumbers').each(($el) => {
      cy.wrap($el)
        .next('div')
        .find('input')
        .invoke('val')
        .then((inputNumber) => {
          if (inputNumber == number) {
            cy.wrap($el)
              .parent()
              .parent()
              .parent()
              .last()
              .within(() => {
                cy.get('span.cursor-pointer').click()
              })
          }
        })
    })
  }
  inputNewAddress(address, index = 0) {
    cy.get(':nth-child(6) > .row')
      .eq(index)
      .last()
      .within(() => {
        cy.get('.col-lg-9 > :nth-child(1) > :nth-child(1)').within(($country) => {
          cy.wrap($country).clickCwDropdownItem(address.country)
        })
        cy.get('.col-lg-9 > :nth-child(1) > :nth-child(2)').within(($type) => {
          this.getSelectType($type).then(() => {
            this.clickSiblingDropdownVisibility(address.type)
          })
          this.getSelectVisibility($type).then(() => {
            this.clickSiblingDropdownVisibility(address.visibility)
          })
        })
        cy.get(
          '.col-lg-9 > :nth-child(2) > :nth-child(1) input[placeholder="Enter street address 1"]'
        ).type(`${address.streetAddress1}`)
        cy.get(
          '.col-lg-9 > :nth-child(2) > :nth-child(2) input[placeholder="Enter street address 2"]'
        ).type(`${address.streetAddress2}`)
        cy.get('.col-lg-9 > :nth-child(3) > :nth-child(1) input[placeholder="Enter City"]').type(
          `${address.city}`
        )
        cy.get(
          '.col-lg-9 > :nth-child(3) > :nth-child(2) input[placeholder="Enter State / Province"]'
        ).type(`${address.state}`)
        cy.get(
          '.col-lg-9 > :nth-child(3) > :nth-child(3) input[placeholder="Enter Postal Code"]'
        ).type(`${address.postalCode}`)
      })
  }
  removeAddressFieldByIndex(subject) {
    cy.wrap(subject).within(() => {
      cy.get('.preferred-radio-wrapper .cursor-pointer').click()
    })
  }
  removeTheLastAddress() {
    cy.get('.row.address').each(($address) => {
      this.removeAddressFieldByIndex($address)
    })
  }
  clickUpdateContactInfo() {
    this.clickUpdateContactInfoButton()
    this.expectedUpdateButtonDisabled()
    this.expectedShowSuccessUpdateToast()
  }
  clickUpdateContactInfoIfEnable() {
    cy.get('button:contains("Update Contact info")')
      .invoke('prop', 'disabled')
      .then(($disabled) => {
        if (!$disabled) this.clickUpdateContactInfoButton()
      })
  }
  verifyVerificationEmailTemplate(email) {
    this.emailHelper
      .getReceivedEmail(this.verificationEmailSubject, email, true)
      .then(($receiveEmail) => {
        this.verifyVerificationEmail($receiveEmail)
        cy.wrap($receiveEmail).getEmailElementHref(Field.CONFIRM)
      })
  }
  clickConfirmInVerificationEmail() {
    cy.get('@elementHref').then(($url) => {
      cy.visit($url)
    })
  }
  verifyVerificationEmail(subject) {
    const emailTemplate = new DOMParser().parseFromString(subject, 'text/html')
    if (emailTemplate.getElementsByTagName('table').length) {
      cy.wrap(subject).emailContains(this.verificationEmailSubject)
      cy.wrap(subject).emailContains(this.greeting)
      cy.wrap(subject).emailContains(this.verificationEmailBody)
    }
  }
  expectedShowUnverifiedEmail(email) {
    cy.get('@email').within(($email) => {
      cy.contains('span.text-black', email).should('be.visible')
      cy.contains('span > i', '(Unverified)').should('be.visible')
      cy.contains('a', 'Resend verification email').should('be.visible')
      cy.wrap($email).hasSvgIcon()
    })
  }
  expectedShowVerifiedEmail(email) {
    cy.get('.edit-contact-info > :nth-child(4) > .row')
      .last()
      .within(($emailWrapper) => {
        cy.wrap($emailWrapper).as('emailWrapper')
        cy.contains('span.text-black > i', '(Unverified)').should('not.exist')
        cy.contains('a', 'Resend verification email').should('not.exist')
        cy.get('input.form-control')
          .invoke('prop', 'value')
          .then(($email) => {
            expect($email).to.contain(email)
          })
        cy.get('.visibility-dropdown-wrapper').should('be.visible')
        cy.get('.preferred-radio-wrapper').should('be.visible')
      })
  }
  removeVerifiedContactEmail() {
    cy.get('@emailWrapper').within(() => {
      cy.get('.preferred-radio-wrapper .cursor-pointer').click()
    })
  }
  removeAllVerifiedContactEmail() {
    const selector = 'label:contains("Contact Email")'
    cy.get('.edit-contact-info').within(($editContact) => {
      const totalItems = $editContact.find(selector).length
      for (let i = 0; i < totalItems; i++) {
        cy.get(selector).last().parents('.col-12').parent().as('emailWrapper')
        this.removeVerifiedContactEmail()
      }
    })
  }
  removeAllUnverifiedEmail(email) {
    const selector = `span:contains("${email}")`
    cy.get('.edit-contact-info').within(($editContact) => {
      const totalItems = $editContact.find(selector).length
      for (let i = 0; i < totalItems; i++) {
        cy.get(selector)
          .last()
          .parents('.col-lg-8')
          .parent()
          .within(() => {
            cy.get('.ml-auto.cursor-pointer').click()
          })
      }
    })
  }
}

export default ContactInfo
