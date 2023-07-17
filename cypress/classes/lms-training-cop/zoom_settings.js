import Environment from '../base/Environment'
import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import { CoPConst } from './base/CoPStub'

class ZoomSettings {
  #url
  #zoomInfo
  #itcFetchZoomAccount = new InterceptReq('/setting/zoom_account/fetch', 'fetchZoomAccount')
  #itcFetchHelpGuideDetail = new InterceptReq('/help-guide/detail/fetch', 'fetchHelpGuideDetail')
  #itcUpdateZoomAccount = new InterceptReq('/setting/zoom_account/update', 'updateZoomAccount')
  #itcFetchCourseActivities = new InterceptReq(
    '/manage_courses/course_activities/fetch',
    'fetchCourseActivities'
  )
  #itcFetchZoomAccounts = new InterceptReq(
    '/manage_courses/course_activities/zoom_accounts',
    'fetchZoomAccounts'
  )
  #itcRemoveZoomAccount = new InterceptReq('/setting/zoom_account/delete', 'removeZoomAccount')
  #itcModifyCourseActivity = new InterceptReq(
    '/manage_courses/course_activity/modify',
    'modifyCourseActivity'
  )

  constructor(url) {
    this.#url = url
  }

  setZoomSettingsUrl(url) {
    this.#url = url[new Environment().getEnvYaml()]
  }

  setZoomInfo(zoomInfo) {
    this.#zoomInfo = zoomInfo
  }

  verifyZoomSettingsPage() {
    this.visitZoomSettings()
    this.expectToSeeZoomSettingsPage()
    this.addZoomAccount()
    this.expectToSeeAddZoomAccountPopup()
    this.verifyThreedotItems()
    this.readHelpGuide()
    this.expectToSeeHelpGuideDetailPage()
  }

  visitZoomSettings() {
    this.#itcFetchZoomAccount.set()
    cy.visit(this.#url)
    this.#itcFetchZoomAccount.wait()
    cy.waitLoadingOverlayNotExist()
  }

  editZoom(accountName) {
    cy.cwTable()
      .rowName(accountName)
      .within(($row) => {
        cy.wrap($row).get('.three-dots-icon').click()
        cy.wrap($row).clickDropdownName(Field.EDIT)
      })
  }

  expectToSeeZoomSettingsPage() {
    cy.get('#_copMemberManagementPortlet_cw-dropdown_').should('contain.text', 'Zoom Settings')
    cy.get('.cec-card__main-content')
      .should('be.visible')
      .within(($mainContent) => {
        cy.wrap($mainContent)
          .get('.cec-mt-md-0 > .cec-p-4')
          .find('h1')
          .should('contain.text', 'Zoom Accounts')
          .parent()
          .find('button')
          .should('contain.text', 'Add Zoom Account')
        cy.wrap($mainContent).get('.table-cell-content').should('contain.text', 'Zoom Name')
      })
    cy.get('.cec-card__right-content').within(($rightContent) => {
      cy.wrap($rightContent).get('.tip-wrapper').should('contain.text', 'Zoom Settings')
    })
  }

  addZoomAccount() {
    cy.cecCard()
      .cardMainContent()
      .within(($mainContent) => {
        cy.wrap($mainContent).find('button').contains('Add Zoom Account').click()
      })
  }

  expectToSeeAddZoomAccountPopup() {
    cy.swal2()
      .should('be.visible')
      .within(($popup) => {
        cy.wrap($popup).get('#swal2-title').should('contain.text', 'Add Zoom Account')
      })
      .closeSwal2()
  }

  verifyThreedotItems() {
    cy.cwTable()
      .find('tr')
      .first()
      .within(($zoomAccout) => {
        cy.wrap($zoomAccout).get('.three-dots-icon').as('threeDot').click()
        cy.wrap($zoomAccout)
          .find('ul > li')
          .should('have.length', '2')
          .eq(0)
          .should('contain.text', Field.EDIT)
          .as(Field.EDIT)
          .parent()
          .find('li')
          .eq(1)
          .should('contain.text', Field.REMOVE)
          .as(Field.REMOVE)
        cy.get('@Edit').click()
        cy.wrap($zoomAccout)
          .swal2()
          .should('be.visible')
          .within(($popup) => {
            cy.wrap($popup)
              .get('#swal2-title')
              .should('contain.text', 'Edit Zoom Account')
              .closeSwal2()
          })
        cy.get('@threeDot').click()
        cy.get('@Remove').click()
        cy.wrap($zoomAccout).swal2Confirm(Field.YES_REMOVE).should('be.visible').closeSwal2()
      })
  }

  readHelpGuide() {
    this.#itcFetchHelpGuideDetail.set()
    cy.get('.cec-card__right-content').within(($rightContent) => {
      cy.wrap($rightContent).get('a').contains('Read Help Guide').click()
    })
    this.#itcFetchHelpGuideDetail.wait()
  }

  expectToSeeHelpGuideDetailPage() {
    cy.get('#_helpGuidePortlet_helpGuideDetail')
      .should('be.visible')
      .within(($helpGuideDetail) => {
        cy.wrap($helpGuideDetail).find('h1').should('contain.text', 'Setting up a Zoom Account')
      })
  }

  fillInZoomInfo() {
    cy.get('.swal2-popup').within(($popup) => {
      this.accountNameField($popup).clear().type(this.#zoomInfo.zoomAccountName)
      this.hostEmailField($popup).clear().type(this.#zoomInfo.hostEmail)
      this.apiKeyField($popup).clear().type(this.#zoomInfo.apiKey)
      this.secretKeyField($popup).clear().type(this.#zoomInfo.secretKey)
    })
  }

  checkRequiredField(zoomInfo) {
    cy.get('.swal2-popup').within(($popup) => {
      this.expectAddButtonDisable($popup)
      this.accountNameField($popup).type(zoomInfo.zoomAccountName)
      this.expectAddButtonDisable($popup)
      this.hostEmailField($popup).type(zoomInfo.hostEmail)
      this.expectAddButtonDisable($popup)
      this.apiKeyField($popup).type(zoomInfo.apiKey)
      this.expectAddButtonDisable($popup)
      this.secretKeyField($popup).type(zoomInfo.secretKey)
      this.expectAddButtonEnable($popup)
      this.hostEmailField($popup).clear()
      this.expectAddButtonDisable($popup)
    })
  }

  secretKeyField($popup) {
    return cy
      .wrap($popup)
      .find('input[placeholder = "Enter Client Secret Key in Zoom App credential"]')
  }

  apiKeyField($popup) {
    return cy.wrap($popup).find('input[placeholder = "Enter Client ID in Zoom App credential"]')
  }

  hostEmailField($popup) {
    return cy.wrap($popup).find('input[placeholder = "Enter the host email"]')
  }

  accountNameField($popup) {
    return cy.wrap($popup).find('input[placeholder = "Enter the account name"]')
  }

  expectInvalidEmailFormat() {
    cy.get('.swal2-popup').within(($popup) => {
      cy.wrap($popup)
        .find('label')
        .contains('Host Email')
        .parents('.form-group')
        .should('contain.text', 'Invalid Email Format.')
        .find('div')
        .should('have.class', 'has-error')
    })
  }

  add() {
    this.#itcUpdateZoomAccount.set()
    cy.get('.swal2-popup').within(($popup) => {
      cy.wrap($popup).find('button').contains(Field.ADD).click()
    })
    this.#itcUpdateZoomAccount.wait()
  }

  expectAddButtonEnable($popup) {
    cy.wrap($popup).find('button').contains(Field.ADD).should('not.have.attr', 'disabled')
  }

  expectAddButtonDisable($popup) {
    cy.wrap($popup).find('button').contains(Field.ADD).should('have.attr', 'disabled')
  }

  accessToCiCourseActivitiesBy(courseId, courseInstanceId) {
    this.#itcFetchCourseActivities.set()
    cy.visit(
      `${CoPConst.URL}/admin/admin?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_copMemberManagementPortlet_id=${courseInstanceId}&_copMemberManagementPortlet_tab=overview&_copMemberManagementPortlet_courseId=${courseId}#_copMemberManagementPortlet_tab=activities`
    )
    cy.get(
      '.cec-card__right-content > :nth-child(2) > .nav > a:contains("Course Activities")'
    ).click() // TODO: Remove after fix render by url
    this.#itcFetchCourseActivities.wait()
  }

  addLearningActivities() {
    cy.get('.cec-card__right-content').within(($rightContent) => {
      cy.wrap($rightContent).find('a').contains('Add Learning Activities').click()
    })
  }

  addVirtualClass() {
    cy.get('.swal2-popup').within(($popup) => {
      cy.wrap($popup).find('span').contains('Virtual Class').parents('.cursor-pointer').click()
    })
  }

  addVirtualClassZoomAccount() {
    this.#itcFetchZoomAccounts.set()
    cy.get('#_copMemberManagementPortlet_activityAccordion').within(($activities) => {
      cy.wrap($activities)
        .find('.accordion-body')
        .parents('.item-re-order')
        .find('a')
        .contains('Add Zoom Account')
        .click()
    })
    this.#itcFetchZoomAccounts.wait()
  }

  expectToSeeZoomAccount() {
    cy.get('.swal2-popup').within(($popup) => {
      cy.wrap($popup)
        .find('span')
        .contains(this.#zoomInfo.zoomAccountName)
        .parents('.card')
        .should('be.visible')
    })
  }

  expectToSeeDuplicatedZoomAccountInSelectZoom() {
    cy.get('.swal2-popup').within(($popup) => {
      cy.wrap($popup)
        .get(`span:contains("${this.#zoomInfo.zoomAccountName}")`)
        .should('be.visible')
        .and('have.length', '2')
    })
  }

  prepareDataForCreateDuplicateAccount() {
    cy.cwTable()
      .invoke('text')
      .then(($text) => {
        if ($text.includes(this.#zoomInfo.zoomAccountName)) {
          cy.get('@cwTable')
            .rowName(this.#zoomInfo.zoomAccountName)
            .its('length')
            .then((size) => {
              while (size > 1) {
                this.removeAccount()
                size--
              }
            })
        }
      })
  }

  removeAccount() {
    cy.cwTable()
      .invoke('text')
      .then(($text) => {
        if ($text.includes(this.#zoomInfo.zoomAccountName)) {
          this.#itcRemoveZoomAccount.set()
          cy.get('@cwTable')
            .rowName(this.#zoomInfo.zoomAccountName)
            .first()
            .within(($row) => {
              cy.wrap($row).get('.three-dots-icon').click()
              cy.wrap($row).clickDropdownName(Field.REMOVE)
            })
          cy.swal2Confirm(Field.YES_REMOVE).click()
          this.#itcRemoveZoomAccount.wait()
        }
      })
  }

  expectToSeeNewZoomAccount() {
    cy.cwTable().rowName(this.#zoomInfo.zoomAccountName).first().should('be.visible')
  }

  expectToSeeDuplicatedZoomAccount() {
    cy.cwTable().rowName(this.#zoomInfo.zoomAccountName).should('have.length', '2')
  }

  expectToSeeAddSuccessToast() {
    cy.get('.toast-notification-full-width')
      .should('be.visible')
      .and('contain.text', 'The zoom account has been added.')
  }

  editVirtualActivity(activityName) {
    cy.get('.course-activities-holder').within(($activityHolder) => {
      cy.wrap($activityHolder)
        .find('span')
        .contains(activityName)
        .first()
        .parents('a')
        .within(($row) => {
          cy.wrap($row).get('.three-dots-icon').click()
          cy.wrap($row).clickDropdownName(Field.EDIT)
        })
    })
  }

  expectUsedZoomAccountUpdated() {
    cy.get('.course-activity-view')
      .eq(0)
      .within(($activityView) => {
        cy.wrap($activityView)
          .find('label:contains("Zoom Account")')
          .parent()
          .find('.bg-light')
          .should('contain.text', this.#zoomInfo.zoomAccountName)
      })
  }

  expandActivity(activityName) {
    cy.get('.course-activities-holder').find('span').contains(activityName).click()
  }

  expectToSeeMessageZoomHasBeenRemoved() {
    cy.get('.accordion-body').getValidationError('This Zoom account has been removed.')
  }

  addVirtualActivityZoomAccount() {
    cy.get('.swal2-popup').within(($popup) => {
      cy.wrap($popup).find('span').contains(this.#zoomInfo.zoomAccountName).click()
      cy.wrap($popup).find('button').contains('use').click()
    })
  }

  saveVirtualActivity() {
    this.#itcModifyCourseActivity.set()
    cy.get('.accordion-body').find('button').contains(Field.SAVE).click()
    this.#itcModifyCourseActivity.wait()
  }
}

export default ZoomSettings
