import Field from '../constants/Field'
import MyProfile from './MyProfile'

class ProfileInfo extends MyProfile {
  checkDefaultProfileInMyProfile(name) {
    cy.get('.profile-summary-wrapper')
      .first()
      .within(() => {
        this.checkDefaultProfileImageVisible()
        cy.contains('p', name).should('be.visible')
      })
    cy.contains('.connect-button', 'Connect').should('be.visible')
  }
  checkProfileInMyProfile(name, imageId, button = 'Connect') {
    cy.get('.profile-summary-wrapper')
      .first()
      .within(() => {
        this.checkProfileImageTokenId(imageId)
        cy.contains('p', name).should('be.visible')
      })
    cy.contains('.connect-button', button).should('be.visible')
  }
  checkDefaultProfileInGlobalSearch(name, button = 'Add Connection') {
    cy.contains('.user-card-title', name)
      .parents('.connection-card')
      .within(() => {
        this.checkDefaultProfileImageVisible()
        cy.contains('.btn-default.btn-block', button).should('be.visible')
      })
  }
  checkProfileInGlobalSearch(
    name,
    imageId,
    button = 'Message',
    hasConnection = false
  ) {
    cy.get('.connection-card')
      .first()
      .within(() => {
        this.checkProfileImageTokenId(imageId)
        cy.contains('.user-card-title', name).should('be.visible')
        cy.contains('.btn-default', button).should('be.visible')
        if (hasConnection) {
          cy.getDropdownName('Remove Connection')
        }
      })
  }
  checkDefaultProfileImageVisible() {
    cy.get('.img-circle')
      .should('be.visible')
      .invoke('attr', 'style')
      .then(($style) => {
        expect($style).to.contain(this.defaultImage)
      })
  }
  clickOpenEditProfileImagePopup() {
    cy.wait(2000)
    cy.get('.edit-profile-image > a.btn-change-photo').invoke('show').click()
    cy.wait(2000)
  }
  selectProfileImageVisibility(dropdownItem = 'Network') {
    cy.swal2().within(($popup) => {
      cy.wrap($popup)
        .get('.visibility-dropdown-wrapper')
        .as('dropdownVisibility')
      this.clickDropdownVisibilityItem(dropdownItem)
    })
  }
  clickSaveProfileImage() {
    this.itcChangeProfilePicture.set()
    cy.get('.button-holder .btn-primary').click()
    this.itcChangeProfilePicture.wait()
    cy.wait(3000)
  }
  clickProfileUserCard() {
    this.itcFetchViewMode.set()
    cy.get('.connection-card').first().click()
    this.itcFetchViewMode.wait()
  }
  checkDetailSvg(subject) {
    cy.wrap(subject)
      .parent()
      .within(($parent) => {
        cy.wrap($parent).get('.col-1').hasSvgIcon()
      })
  }
  checkExpertise(subject, items = []) {
    cy.get(subject).within(() => {
      if (!items.length) {
        cy.contains('span', 'No data').should('be.visible')
      } else {
        items.forEach((item) => {
          cy.contains('ul > li > span', item).should('be.visible')
        })
      }
    })
  }
  checkUserDetailUrl(type, url) {
    cy.get(`p:contains('${type}')`)
      .should('be.visible')
      .eq(1)
      .parentsUntil('.cec-mb-6.d-flex')
      .within(($type) => {
        cy.wrap($type).get(`a[href="${url}"]`).should('be.visible')
        this.checkDetailSvg($type)
      })
  }
  checkUserDetail(type, value) {
    cy.get(`p:contains('${type}')`)
      .should('be.visible')
      .eq(1)
      .parent()
      .within(($type) => {
        cy.wrap($type).contains('span', value).should('be.visible')
        this.checkDetailSvg($type)
      })
  }
  checkProfileHeadline(content) {
    cy.contains('p.headline, .profile-headline > q', content).should(
      'be.visible'
    )
  }
  checkEmail(email, type = 'Personal') {
    cy.get(`p:contains("Email (${type})") + p:contains(${email})`).should(
      'be.visible'
    )
  }
  checkEmailInGlobalSearch(email) {
    cy.get(`.user-card-content > div > p > a:contains(${email})`).should(
      'be.visible'
    )
  }
  checkAddress(address, type = 'Field Side Address') {
    cy.get(`p:contains("Address (${type})") + p:contains(${address})`).should(
      'be.visible'
    )
  }
  checkPhoneNumber(number, type = 'Personal', countryCode = 'KH') {
    cy.get(`p:contains(Phone (${type}))`)
      .parent()
      .first()
      .within(($phone) => {
        cy.wrap($phone)
          .get('.vue-tel-input .input-phone-number')
          .invoke('prop', 'value')
          .then(($number) => {
            expect($number).to.equal(number)
          })
        cy.wrap($phone).get(`.iti-flag.${countryCode}`).should('be.visible')
      })
  }
  verifyExpertiseAndQualifications({
    areaOfFocus = [],
    skillsAndExpertise = [],
    languages = [],
    interestsAndHobbies = [],
  }) {
    this.clickExpertiseAndQualificationTab()
    this.checkExpertise('@areaOfFocus', areaOfFocus)
    this.checkExpertise('@skillsAndExpertise', skillsAndExpertise)
    this.checkExpertise('@languages', languages)
    this.checkExpertise('@interestsAndHobbies', interestsAndHobbies)
  }
  verifyDetailInfo(details) {
    this.verifyDetailSection(details)
    this.verifyCurrentJobSection(details)
  }
  verifyDetailSection(details) {
    this.checkUserDetail('Known As', details.knownAs)
    this.checkUserDetail('Gender', details.gender)
    this.checkUserDetail('Birthday', details.birthday)
  }
  verifyCurrentJobSection(details) {
    cy.scrollTo('bottom')
    this.checkUserDetail('Company:', details.company)
    this.checkUserDetail('Job Title:', details.jobTitle)
    this.checkUserDetail('Position:', details.position)
  }
  verifyContactInfo(contactInfo) {
    cy.searchGlobal(contactInfo.screenName)
    this.checkDefaultProfileInGlobalSearch(contactInfo.fullName.globalSearch)
    this.clickProfileUserCard()
    this.checkDefaultProfileInMyProfile(contactInfo.fullName.myProfile)
    this.checkProfileHeadline(contactInfo.headline)
    this.expectedShowEmails(
      contactInfo.emails.personal.type,
      contactInfo.emails.personal.emails[0]
    )
    this.expectedShowAddress(contactInfo.addresses.fieldSideAddress)
    this.expectedShowPhoneNumber(contactInfo.phoneNumbers.personal.germany)
  }
  getIdFromURLByParam(name) {
    cy.get('.edit-profile-image > .img-circle')
      .invoke('css', 'background-image')
      .then(($style) => {
        cy.getExtractUrlFromContent($style).then(($url) => {
          const imgId = $url.searchParams.get(name)
          cy.wrap(imgId).as('id')
        })
      })
    return cy.get('@id')
  }
  getProfileImageTokenId() {
    return this.getIdFromURLByParam('img_id_token')
  }
  checkProfileImageTokenId(imageId) {
    if (!imageId) return
    cy.get('.img-circle')
      .should('be.visible')
      .invoke('css', 'background-image')
      .then(($style) => {
        cy.getExtractUrlFromContent($style).then(($url) => {
          cy.request($url.href).its('status').should('eq', 200)
          expect($url.searchParams.get('img_id_token')).to.contain(imageId)
        })
      })
  }
  getProfileImageId() {
    return this.getIdFromURLByParam('img_id')
  }
  checkProfileImage(imageId) {
    cy.get('.img-circle')
      .should('be.visible')
      .invoke('css', 'background-image')
      .then(($style) => {
        cy.getExtractUrlFromContent($style).then(($url) => {
          cy.request($url.href).its('status').should('eq', 200)
          expect($url.searchParams.get('img_id')).to.contain(imageId)
        })
      })
  }
  checkProfileImageIsUpdated(imageId) {
    cy.get('.img-circle')
      .should('be.visible')
      .invoke('css', 'background-image')
      .then(($style) => {
        cy.getExtractUrlFromContent($style).then(($url) => {
          cy.request($url.href).its('status').should('eq', 200)
          expect($url.searchParams.get('img_id')).to.not.equal(imageId)
        })
      })
  }
  checkGlobalProfileImageIsUpdated(imageId) {
    cy.getGlobalProfileImage()
      .should('be.visible')
      .invoke('attr', 'src')
      .then(($src) => {
        const src = location.origin + $src
        cy.getExtractUrlFromContent(src).then(($url) => {
          cy.request($url.href).its('status').should('eq', 200)
          expect($url.searchParams.get('img_id')).not.to.include(imageId)
        })
      })
  }
  verifyMyProfileImage(screenName, imageId, button = 'Add Connection') {
    cy.searchGlobal(screenName)
    this.checkProfileInGlobalSearch(screenName, imageId, button)
    this.clickProfileUserCard()
    this.checkProfileImageTokenId(imageId)
  }
  verifyMyProfileWithDefaultImage(screenName, button) {
    cy.searchGlobal(screenName)
    this.checkDefaultProfileInGlobalSearch(screenName, button)
    this.clickProfileUserCard()
    this.checkDefaultProfileImageVisible()
  }
  checkProfileHeadlineInGlobalSearch(headline) {
    cy.get('.connection-card').within(() => {
      cy.contains('.headline', headline).should('be.visible')
    })
  }
  checkAboutMeNotExist() {
    cy.contains(
      '.edit-community-wrapper .actions-area span',
      'About me'
    ).should('not.exist')
  }
  setMyProfileImageVisibility(visibility) {
    this.clickOpenEditProfileImagePopup()
    this.clickDeleteProfileImage()
    this.selectFileUpload(this._myProfileImagePath)
    this.selectProfileImageVisibility(visibility)
    this.clickSaveProfileImage()
  }
  clickLinkInDetails(type, url) {
    cy.get(`p:contains(${type})`)
      .should('be.visible')
      .eq(1)
      .parent()
      .within(($type) => {
        cy.wrap($type).get(`a[href="${url}"]`).scrollIntoView().click()
      })
  }
  expectedShowAccessExternalLinkPopup(type, url) {
    this.itcCheckExternalLink.set()
    this.clickLinkInDetails(type, url)
    this.itcCheckExternalLink.wait()
    cy.checkAccessExternalLinkPopup(url)
  }
  expectedShowSocialLinks(type, ...urls) {
    urls.forEach((url) => {
      this.checkUserDetailUrl(type, url)
    })
  }
  expectedShowPhoneNumber(...countries) {
    countries.forEach((country) => {
      this.checkPhoneNumber(country.number, country.type, country.countryCode)
    })
  }
  expectedNotShowPhoneNumber(...phones) {
    phones.forEach((phone) => {
      cy.get('.profile-summary-wrapper')
        .last()
        .then(($profileSummary) => {
          if (
            $profileSummary.find(`p:contains("Phone (${phone.type})")`).length >
            0
          ) {
            cy.get(
              `p:contains("Phone (${phone.type})") + div input[placeholder="Enter a phone number"]`
            ).should('not.have.value', phone.number)
          } else {
            cy.get(`p:contains("Phone (${phone.type})")`).should('not.exist')
          }
        })
    })
  }
  expectedShowAddress(...addresses) {
    addresses.forEach((address) => {
      this.checkAddress(address.addresses[0], address.type)
    })
  }
  expectedShowEmails(type, ...emails) {
    emails.forEach((email) => {
      this.checkEmail(email, type)
    })
  }
  expectedNotShowEmails(type, ...emails) {
    emails.forEach((email) => {
      cy.get(`p:contains("Email (${type})") + p:contains(${email})`).should(
        'not.exist'
      )
    })
  }
  expectedExpertiseTabShowEmptyState(user) {
    this.clickExpertiseAndQualificationTab(false)
    cy.wait(1000)
    this.expectShowEmptyState(user.screenName)
  }
  expectedEmptyStateImageAndText() {
    cy.swal2()
      .getSwal2Content()
      .within(($content) => {
        cy.wrap($content).get('img').should('be.visible')
        cy.get('img')
          .invoke('attr', 'src')
          .then((src) => {
            cy.getExtractUrlFromContent(src).then(($url) => {
              cy.request($url.href).its('status').should('eq', 200)
            })
          })
        cy.wrap($content)
          .contains("You don't have any communities yet.")
          .should('be.visible')
      })
  }
  expectedPopupShowCoPList() {
    cy.swal2()
      .getSwal2Content()
      .as('copPopup')
      .within(($content) => {
        const expectedCopNames = [
          'Design Frontendmunity From Design',
          'WebLearn Consent Training Automate',
          'Design Frontendend Org',
        ]
        cy.wrap($content).find('tr').should('have.length.gte', 3)
        expectedCopNames.forEach((copName) => {
          cy.wrap($content).find('tr').should('contains.text', copName)
        })
      })
  }
  expectedSaveButtonStateOnShowInProfileClick() {
    cy.get('@copPopup').within(() => {
      cy.getCheckbox().as('checkbox')

      cy.get('@checkbox')
        .check({ force: true })
        .then(() => {
          cy.buttonNotDisabled()
        })

      cy.get('@checkbox')
        .uncheck({ force: true })
        .then(() => {
          cy.buttonDisabled()
        })
    })
  }
  expectedSaveButtonEnableOnPrimaryClick() {
    cy.get('@copPopup').within(($content) => {
      cy.wrap($content)
        .get('input[type="radio"]')
        .first()
        .check({ force: true })
        .then(() => {
          cy.buttonNotDisabled()
        })
    })
  }
  expectedUnlistedCoPWarningTextIsVisible() {
    cy.get('@copPopup').within(($content) => {
      cy.wrap($content).should(
        'contain',
        'Unlisted Communities can be shown on your profile.'
      )
    })
  }
  viewOtherUserProfileFromSearch(user) {
    cy.searchGlobal(user.screenName)
    this.clickProfileUserCard()
  }
  removeAllMyFocusItemsByInAllField(fields = []) {
    this.openPopupMyFocus()
    fields.forEach((field) => {
      this.removeAllMyFocusItemsBy(field)
    })
    this.clickSaveMyFocusPopup()
  }
  updateMyFocus({
    areaOfFocus = {},
    skillsAndExpertise = {},
    languages = {},
    interestsAndHobbies = {},
  }) {
    this.openPopupMyFocus()
    this.addItemsToMyFocus(areaOfFocus.newItems, areaOfFocus.label)
    this.addItemsToMyFocus(
      skillsAndExpertise.newItems,
      skillsAndExpertise.label
    )
    this.addItemsToMyFocus(languages.newItems, languages.label)
    this.addItemsToMyFocus(
      interestsAndHobbies.newItems,
      interestsAndHobbies.label
    )
    this.clickSaveMyFocusPopup()
  }
  updateRemoveMyFocusItems({
    areaOfFocus = {},
    skillsAndExpertise = {},
    languages = {},
    interestsAndHobbies = {},
  }) {
    this.openPopupMyFocus()
    this.removeMyFocusItems(areaOfFocus.newItems, areaOfFocus.label)
    this.removeMyFocusItems(
      skillsAndExpertise.newItems,
      skillsAndExpertise.label
    )
    this.removeMyFocusItems(languages.newItems, languages.label)
    this.removeMyFocusItems(
      interestsAndHobbies.newItems,
      interestsAndHobbies.label
    )
    this.clickSaveMyFocusPopup()
  }
  clickEditAboutMe() {
    cy.get('.edit-community-wrapper > .cec-pb-1')
      .first()
      .within(($aboutMe) => {
        cy.wrap($aboutMe).get('svg').click()
      })
  }
  clickEditMyCommunity() {
    cy.get('.edit-community-wrapper > .cec-pb-1')
      .eq(1)
      .within(($myCommunity) => {
        cy.wrap($myCommunity).get('svg').first().click()
      })
  }
  updateAboutMe(content) {
    cy.getPopup().within(() => {
      cy.get('textarea#_myProfilePortlet_background').clear()
      if (content) {
        cy.get('textarea#_myProfilePortlet_background').type(content)
      }
      cy.get('button').click()
    })
  }
  expectedShowAboutMe(content) {
    cy.get('.edit-community-wrapper > .cec-pb-1')
      .first()
      .within(() => {
        cy.contains('.info-card span', content).should('be.visible')
      })
  }
  expectedShowProfileUsername(name) {
    cy.contains('.profile-summary-wrapper p', name).should('be.visible')
  }
  checkEmptyStateForActionArea(subject, title, instruction) {
    cy.wrap(subject).contains('span.text-black', title).should('be.visible')
    cy.wrap(subject).hasSvgIcon()
    cy.wrap(subject)
      .contains('.clickable-area.cursor-pointer > i', instruction)
      .should('be.visible')
  }
  expectedShowMyOtherCommunityEmptyState(object) {
    cy.get('.edit-community-wrapper > div')
      .last()
      .within(($otherCop) => {
        this.checkEmptyStateForActionArea(
          $otherCop,
          object.title,
          object.instruction
        )
      })
  }
  expectedShowMyPrimaryCommunityEmptyState(object) {
    cy.get('.edit-community-wrapper > div')
      .eq(1)
      .within(($primaryCop) => {
        this.checkEmptyStateForActionArea(
          $primaryCop,
          object.title,
          object.instruction
        )
      })
  }
  expectedShowAboutMeEmptyState(object) {
    cy.get('.edit-community-wrapper > div')
      .first()
      .within(($aboutMe) => {
        this.checkEmptyStateForActionArea(
          $aboutMe,
          object.title,
          object.instruction
        )
      })
  }
  expectedShowMyFocusEmptyState(object) {
    cy.get('.cec-card__right-content .action-area')
      .first()
      .within(($myFocus) => {
        this.checkEmptyStateForActionArea(
          $myFocus,
          object.title,
          object.instruction
        )
      })
  }
  checkEmailUnderContactInfoInMyProfile(email) {
    this.checkEmail(email)
  }
  expectedNotShowKnownAs() {
    cy.getElementWithLabel(`Known As:`).should('not.exist')
  }
  expectedNotShowGender() {
    cy.getElementWithLabel(`Gender:`).should('not.exist')
  }
  expectedNotShowBirthday() {
    cy.getElementWithLabel(`Birthday:`).should('not.exist')
  }
  selectPrimaryCop(copName) {
    cy.swal2().within(($swal2) => {
      cy.wrap($swal2)
        .get(`span:contains("${copName}")`)
        .parents('tr')
        .within(($tr) => {
          cy.wrap($tr).as('rowData')
        })
    })
    cy.get('@rowData').within(($rowData) => {
      cy.wrap($rowData)
        .get('td')
        .last()
        .within(($td) => {
          cy.wrap($td).getRadioButton('Primary').click()
          cy.wrap($td).checkedRadioButton()
        })
    })
  }
  clickButtonSaveEditCopPopup() {
    this.itcModifiedCommunity.set()
    cy.swal2().within(() => {
      cy.clickPrimaryButton(Field.SAVE)
    })
    this.itcModifiedCommunity.wait()
  }
  getPrimaryCopName() {
    cy.get('span:contains("My Primary Community of Purpose")')
      .parents('div.action-area')
      .within(() => {
        cy.get('.cop-info .cursor-pointer .text-primary').as('primaryCopName')
      })
  }
  expectedPrimaryCopUpdate(oldPrimaryCopName, newPrimaryCopName) {
    expect(oldPrimaryCopName).not.to.be.equal(newPrimaryCopName)
  }
  expectedSeePrimaryCop(copName, userName) {
    const who = userName ? userName + `'s` : 'My'
    cy.get(`span:contains("${who} Primary Community of Purpose")`)
      .parents('div.action-area')
      .within(() => {
        cy.get('.cop-info .cursor-pointer .text-primary').should(
          'have.text',
          `Visit ${copName}`
        )
      })
  }
  expectedMyProfileShowAfterUpload(cssTransform) {
    cy.swal2().within(() => {
      cy.get('.cr-boundary > canvas')
        .should('have.attr', 'style')
        .and('include', 'translate3d')
      // TODO: Studio run and cli run make canvas value different
    })
  }
  couldZoomImage(range) {
    cy.get('.cr-slider-wrap').within(() => {
      cy.get('.cr-slider').controlledInputChange(range)
    })
  }
  clickRotateImageLeft() {
    cy.get('.icon-rotate__container').within(() => {
      cy.get('a').first().click()
    })
  }
  clickRotateImageRight() {
    cy.get('.icon-rotate__container').within(() => {
      cy.get('a').last().click()
    })
  }
  seeWhoCanSeeThisLabel() {
    cy.expectElementWithLabelVisible('Who can see this?', '#swal2-content div')
  }
  expectedSeeDeleteImage() {
    cy.expectElementWithLabelVisible('Delete image', 'span')
  }
  expectedSeeChangeProfileImageButton() {
    cy.expectElementWithLabelVisible('Change image', 'button')
  }
  expectedSeeSaveUploadProfileImageButton() {
    cy.expectElementWithLabelVisible(Field.SAVE, 'button')
  }
  verifyEditYourImagePopup(myProfileImage1, index = 0) {
    this.clickOpenEditProfileImagePopup()
    this.selectFileUpload(this._myProfileImage1Path)
    this.expectedMyProfileShowAfterUpload(myProfileImage1.original[index])
    this.couldZoomImage(1)
    this.expectedMyProfileShowAfterUpload(myProfileImage1.zoomIn1[index])
    this.couldZoomImage(0)
    this.expectedMyProfileShowAfterUpload(myProfileImage1.zoomOut0[index])
    this.clickRotateImageLeft()
    this.expectedMyProfileShowAfterUpload(myProfileImage1.rotateLeft[index])
    this.clickRotateImageRight()
    this.expectedMyProfileShowAfterUpload(myProfileImage1.rotateRight[index])
    this.expectedSeeDeleteImage()
    this.expectedSeeChangeProfileImageButton()
    this.expectedSeeSaveUploadProfileImageButton()
    this.seeWhoCanSeeThisLabel()
  }
  getCertificateRowElementBy(courseName) {
    cy.getPopup().within(($popup) => {
      cy.wrap($popup).as('popup')
      cy.wrap($popup).getPopupFooter().as('popupFooter')
      cy.getElementWithLabel(courseName, 'label')
        .parents('tr')
        .first()
        .within(($tr) => {
          cy.wrap($tr).as('tr')
        })
    })
  }
  checkCertificate() {
    cy.get('@tr').within(() => {
      cy.getCheckbox().check()
    })
  }
  uncheckCertificate() {
    cy.get('@tr').within(() => {
      cy.getCheckbox().uncheck()
    })
  }
  disableCourseCertificateIfEnabledBy(courseName) {
    this.clickIconEditCertificate()
    this.getCertificateRowElementBy(courseName)
    cy.get('@tr').within(() => {
      cy.getCheckbox()
        .invoke('prop', 'checked')
        .then(($checked) => {
          if ($checked) {
            this.uncheckCertificate()
            this.clickSaveCertificateUpdate()
          } else {
            cy.get('@popup').closePopup()
          }
        })
    })
  }
  enableCourseCertificateBy(courseName) {
    this.clickIconEditCertificate()
    this.getCertificateRowElementBy(courseName)
    this.checkCertificate()
    this.clickSaveCertificateUpdate()
  }
  clickSaveCertificateUpdate() {
    cy.get('@popupFooter').within(() => {
      this.itcModifyCertificate.set()
      cy.clickPrimaryButton(Field.SAVE)
      this.itcModifyCertificate.wait()
    })
  }
  changeShowCertificateVisibility(visibility) {
    cy.getPopup().within(($popup) => {
      cy.wrap($popup)
        .find('.visibility-dropdown-wrapper')
        .as('dropdownVisibility')
      cy.get('@dropdownVisibility').within(() => {
        this.clickDropdownVisibilityItem(visibility)
        cy.wait(1000)
      })
    })
  }
  updateShowCertificateVisibilityOnMyProfile(
    courseTitle,
    visibility = 'Platform'
  ) {
    this.clickIconEditCertificate()
    this.getCertificateRowElementBy(courseTitle)
    this.changeShowCertificateVisibility(visibility)
    this.clickSaveCertificateUpdate()
  }
}

export default ProfileInfo
