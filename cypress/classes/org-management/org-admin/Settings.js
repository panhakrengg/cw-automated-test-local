import InterceptAction from '../../base/InterceptAction'
import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import GlobalMenu from '../../global-menu/GlobalMenu'
import EmailOrgManagement from '../../notification/email/EmailOrgManagement'
import SignInAs from '../../utilities/SignInAs'
import UserRole from '../../utilities/user-role/UserRole'
import ManageMemberProfile from '../ManageMemberProfile'
import ManageUser from '../ManageUser'
import { OrgConst } from '../base-org-management/OrgStub'
import EmailVerification from '../org-structure/EmailVerification'

const globalMenu = new GlobalMenu()
class Settings {
  manageUser = new ManageUser()
  manageMemberProfile = new ManageMemberProfile()

  _weblearnLogoPath = 'organization/weblearn/org-admin/logo-and-favicon.jpg'
  _fixturesLocation = 'cypress/fixtures/'
  _updated = ' updated'
  _updateToastMessage = 'Settings have been updated.'
  _customSupportPageContactDes =
    'We’d love to hear from you. Send us an email at support@website.com.'
  _customInviteEmailText = 'Custom Email Invite users'
  _customWelcomeEmailText = 'Custom Email welcome users'

  _itcCustomEmail = new InterceptAction('/organization/custom_email/change', 'CustomEmail')
  _itcSupportPage = new InterceptAction('/organization/support_page/change', 'SupportPage')
  _itcUploadOrgFavicon = new InterceptReq('/organization/upload-favicon', 'UploadOrgFavicon')
  _itcFetchOrgFavicon = new InterceptReq('/org_management/fetch_org_favicon', 'FetchOrgFavicon')
  _itcDeleteOrgFavicon = new InterceptReq('/organization/delete-favicon', 'DeleteOrgFavicon')
  _itcFetchSupportPageText = new InterceptReq('/support_page/fetch_text', 'FetchSupportPageText')

  defineAliasSettingItem(label, alias) {
    cy.cecCardBody().contains('div.cec-card > a', label).as(`${alias}Toggle`)
    cy.get(`@${alias}Toggle`).parent().as(`${alias}`)
  }

  defineAliasSettingItemBody(alias) {
    cy.get(`@${alias}Toggle`).click()
    cy.get(`@${alias}`).within(() => {
      cy.get('div.collapse > div').as(`${alias}Body`)
    })
  }

  goToCustomSupportPage() {
    this.defineAliasSettingItem('Custom Support Page', 'customSupportPage')
    this.defineAliasSettingItemBody('customSupportPage')
  }

  goToAccountSecurity() {
    this.defineAliasSettingItem('Account Security', 'accountSecurity')
    this.defineAliasSettingItemBody('accountSecurity')
  }

  goToCustomEmail() {
    this.defineAliasSettingItem('Custom Email', 'customEmail')
    this.defineAliasSettingItemBody('customEmail')
    this.defineAliasCustomInviteEmail()
    this.defineAliasCustomWelcomeEmail()
    cy.get('#collapsecustomEmail .control-label').first().as('labelForClickOutSideToSave')
  }

  goToBranding() {
    this.defineAliasSettingItem('Branding', 'branding')
    this.defineAliasSettingItemBody('branding')
    this.defineAliasFaviconWrapper()
  }

  defineAliasFaviconWrapper() {
    cy.get('@brandingBody')
      .contains('div.org-change-favicon-wrapper', 'Favicon')
      .as('faviconWrapper')
  }

  defineAliasCustomInviteEmail() {
    cy.get('@customEmailBody').first().as('customInviteEmail')
  }

  defineAliasCustomWelcomeEmail() {
    cy.get('@customEmailBody').last().as('customWelcomeEmail')
  }

  writeUpdateInEditorThenSave(subject, customText, editorName) {
    cy.get(`@${subject}`).within(() => {
      cy.editorElementContain('h1', customText)
      cy.typeInEditor(this._updated, editorName)
      const editor = `@${editorName}`
      cy.get(editor).focus()
    })
    this.triggerSaveCustomEmail()
    cy.expectToastMessage(this._updateToastMessage)
  }

  updateCustomInviteEmail() {
    this.writeUpdateInEditorThenSave(
      'customInviteEmail',
      this._customInviteEmailText,
      'inviteEditor'
    )
  }

  updateCustomWelcomeEmail() {
    this.writeUpdateInEditorThenSave(
      'customWelcomeEmail',
      this._customWelcomeEmailText,
      'welcomeEditor'
    )
  }

  removeUpdateTextInCustomInviteEmail() {
    cy.get('@customInviteEmail').within(() => {
      this.updateTextEditorCustomEmail(this._customInviteEmailText)
    })
  }
  removeUpdateTextInCustomWelcomeEmail() {
    cy.get('@customWelcomeEmail').within(() => {
      this.updateTextEditorCustomEmail(this._customWelcomeEmailText)
    })
  }
  updateTextEditorCustomEmail(text) {
    cy.editorElementContain('h1', text)
      .invoke('text')
      .then((text) => {
        cy.wrap(text.includes(this._updated)).as('updated')
        this.triggerSaveEmail()
      })
  }
  triggerSaveEmail() {
    cy.get('@updated').then((updated) => {
      if (updated) {
        this.typeBackSpace8TimesInEditor()
        this.triggerSaveCustomEmail()
      }
    })
  }

  getLinkUrl(label) {
    return cy.contains('a', label).should('have.attr', 'href')
  }

  verifyUpdateCustomSupportPage() {
    cy.get('@customSupportPageBody').within(() => {
      this.getLinkUrl('Preview Page').as('previewPageUrl')
      cy.editorElementContain('p', this._customSupportPageContactDes)
      cy.typeInEditor(this._updated)
      Cypress.on('uncaught:exception', () => false)
    })
    this.triggerSaveCustomSupportPage()
    cy.expectToastMessage(this._updateToastMessage)
    this.verifyPreviewSupportPage()
  }

  verifyPreviewSupportPage() {
    this._itcFetchSupportPageText.set()
    cy.get('@previewPageUrl').then(cy.visit)
    this._itcFetchSupportPageText.wait()
    cy.contains(`${this._customSupportPageContactDes}${this._updated}`).as('contactDes')
    cy.get('@contactDes').should('be.visible')
  }

  revertCustomSupportPageText() {
    cy.get('@customSupportPageBody').within(() => {
      cy.editorElementContain('p', this._customSupportPageContactDes)
        .invoke('text')
        .then((text) => cy.wrap(text.includes(this._updated)).as('updated'))
      cy.get('@updated').then((updated) => {
        if (updated) {
          this.typeBackSpace8TimesInEditor()
          this.triggerSaveCustomSupportPage()
          cy.get('@customSupportPageToggle').click()
        }
      })
    })
  }

  verifyRemoveOrgFavicon() {
    this.#isExistFavIcon().then((exist) => {
      if (!exist) {
        cy.get('@faviconWrapper').then(() => cy.get('a.favicon-trash').as('faviconTrash'))
        cy.get('@faviconTrash').hasSvgIcon()
        this.triggerRemoveOrgFavicon()
        cy.expectToastMessage(this._updateToastMessage)
      }
    })
  }

  #uploadOrgFavicon(path = this._weblearnLogoPath) {
    cy.contains('button', 'Select Files').as('selectFilesBtn')
    this.selectUploadFile(path)
    this.getPopupButtonHolder()
    this.triggerUploadOrgFavicon()
    cy.expectToastMessage(this._updateToastMessage)
    this.verifyFaviconUploaded()
  }

  #isExistFavIcon() {
    cy.wrap(true).as('exist')
    cy.get('@faviconWrapper').within(() => {
      cy.contains('button', 'Select Files')
        .parent()
        .invoke('attr', 'style')
        .then(($style) => {
          if ($style !== undefined) {
            if ($style.trim().includes('display: none')) {
              cy.wrap(false).as('exist')
            }
          }
        })
    })
    return cy.get('@exist')
  }

  uploadOrgFavicon(path) {
    this.#isExistFavIcon().then((exist) => {
      if (exist) {
        this.#uploadOrgFavicon(path)
      }
    })
  }

  verifyFaviconUploaded() {
    cy.get('@faviconWrapper')
      .contains('div.favicon-info', 'favicon.png uploaded')
      .should('be.visible')
  }

  getPopupButtonHolder() {
    cy.get('@faviconWrapper')
      .swal2()
      .getSwal2Content()
      .getSwal2ButtonHolder()
      .as('popupButtonHolder')
  }

  selectUploadFile(path) {
    cy.get('@selectFilesBtn').should('be.visible')
    cy.get('@selectFilesBtn').click()
    cy.get('input[type="file"].hide').selectFile(this._fixturesLocation + path, { force: true })
  }

  triggerUploadOrgFavicon() {
    this._itcFetchOrgFavicon.set()
    this._itcUploadOrgFavicon.set()
    cy.get('@popupButtonHolder').contains('button', Field.SAVE).click()
    this._itcUploadOrgFavicon.wait()
    this._itcFetchOrgFavicon.wait()
  }

  triggerRemoveOrgFavicon() {
    this._itcFetchOrgFavicon.set()
    this._itcDeleteOrgFavicon.set()
    cy.get('@faviconTrash').click()
    this._itcDeleteOrgFavicon.wait()
    this._itcFetchOrgFavicon.wait()
  }

  triggerSaveCustomSupportPage() {
    this._itcSupportPage.set()
    cy.get('@customSupportPageToggle').click()
    this._itcSupportPage.wait()
  }

  triggerSaveCustomEmail() {
    this._itcCustomEmail.set()
    cy.get('@labelForClickOutSideToSave')
      .scrollIntoView({ offset: { top: -150, left: 0 } })
      .click({ force: true })
    this._itcCustomEmail.wait()
  }

  typeBackSpace8TimesInEditor() {
    cy.typeInEditor(
      '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}'
    )
  }

  verifyMinimumPasswordLength() {
    cy.get('@accountSecurityBody').then(($wrapper) => {
      cy.get('div.has-error').should('not.exist')
      cy.wrap($wrapper).typeInput(5)
      cy.get('div.has-error')
        .should('be.visible')
        .and('contain.text', 'Please enter a valid number between 8-64')
    })
  }

  verifyMaximumPasswordLength() {
    cy.get('@accountSecurityBody').then(($wrapper) => {
      cy.wrap($wrapper).typeInput(65)
      cy.get('div.has-error')
        .should('be.visible')
        .and('contain.text', 'Please enter a valid number between 8-64')
    })
  }

  resetToggleToTurnOff(iterator) {
    cy.get('@toggleInput')
      .invoke('prop', 'checked')
      .then(($state) => {
        if ($state) {
          this.toggleSwitch(iterator)
        }
      })
  }

  resetToggleToTurnOn(iterator) {
    cy.get('@toggleInput')
      .invoke('prop', 'checked')
      .then(($state) => {
        if (!$state) {
          this.toggleSwitch(iterator)
        }
      })
  }

  initSupportPageElements() {
    cy.get('#collapsecustomSupportPage .cw-toggle-button').as('toggleButton')
    cy.get('@toggleButton').find('.switch').as('toggleSwitch')
    cy.get('@toggleButton').find('input').as('toggleInput')
  }

  initCustomInviteEmailElements() {
    cy.get('#collapsecustomEmail div:nth-child(1) > .cw-toggle-button').as('toggleButton')
    cy.get('@toggleButton').find('.switch').as('toggleSwitch')
    cy.get('@toggleButton').find('input').as('toggleInput')
    cy.get('.toast-notification-full-width').as('toastMessage')
  }

  openSupportPage() {
    cy.get('a[aria-controls="collapsecustomSupportPage"]').contains('Custom Support Page').click()
    this.initSupportPageElements()
  }

  openCustomEmail() {
    cy.get('a[aria-controls="collapsecustomEmail"]').contains('Custom Email').click()
    this.initCustomInviteEmailElements()
  }

  toggleSwitch(iterator) {
    cy.get('@toggleSwitch').click()
    iterator.wait()
  }

  expectedOpenToastMessage() {
    cy.expectToastMessage(this._updateToastMessage)
  }

  expectedEnabledToggle() {
    cy.wait(3000)
    cy.get('@toggleButton').toggleIsEnable()
  }

  accessOrgSettingsViaOrgAdmin() {
    this._itcFetchOrgFavicon.set()
    SignInAs.orgAdmin(OrgConst.TABS.ORGANIZATION_SETTINGS)
    this._itcFetchOrgFavicon.wait()
  }

  signInAsOrgMember() {
    cy.visitThenSignIn('/', UserRole.ORG_MEMBER.NORMAL)
  }

  expectedSupportPageInMegaMenu() {
    globalMenu.getHeaderTitle().click()
    Cypress.on('uncaught:exception', () => false)
    globalMenu.checkLeftHeaderTitleExist('WebLearn Support')
  }

  expectedSupportPageNotInMegaMenu() {
    globalMenu.getHeaderTitle().click()
    Cypress.on('uncaught:exception', () => false)
    globalMenu.checkLeftHeaderTitleNotExist(`WebLearn Support`)
  }

  inviteUserViaEmail(email) {
    cy.visit(this.manageUser.pageUrl())
    this.manageMemberProfile.inviteViaEmail()
    this.manageMemberProfile.inputEmail([email])
    this.manageMemberProfile.next()
    this.manageMemberProfile.sendInvite()
  }
  verifyInvitationEmail(email, emailBody) {
    EmailVerification.emailHelper
      .getReceivedEmail(EmailOrgManagement.INVITE_EMAIL_SUBJECT, email, true)
      .as('invitationEmail')
    cy.get('@invitationEmail').emailContains(EmailOrgManagement.INVITE_EMAIL_SUBJECT)
    cy.get('@invitationEmail').emailContains(emailBody)
  }
  expectedInvitationEmailSentDefaultMessage(email) {
    this.verifyInvitationEmail(email, EmailOrgManagement.INVITE_EMAIL_BODY)
  }
  expectedInvitationEmailSentCustomMessage(email) {
    this.verifyInvitationEmail(email, EmailOrgManagement.INVITE_EMAIL_CUSTOM_BODY)
  }
  getOrgSettingUrl() {
    return OrgConst.TABS.ORGANIZATION_SETTINGS
  }
}

export default Settings
