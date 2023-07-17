import Environment from '../../base/Environment'
import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import { OrgConst } from '../../org-management/base-org-management/OrgStub'
import AdminHelpGuideLogin from '../base-help-guides/member-management/AdminHelpGuideLogin'
import AdminHelpGuideIntercept from '../base-help-guides/operation/AdminHelpGuideIntercept'
import HelpGuidesHome from '../home/HelpGuidesHome'
import AdminHelpGuide from './AdminHelpGuide'
import ModifyArticle from './ModifyArticle'
import ManageArticle from './manage-article/ManageArticle'

class ArticleListScreen {
  inviteUserToOrganization = 'Invite user to organization (has youtube)'
  _itcEdit = new InterceptReq('/help-guide/edit', Field.EDIT)

  constructor() {
    this.adminModifyArticle = new ModifyArticle()
    this.adminHelpGuide = new AdminHelpGuide()
    this.adminHelpGuideLogin = new AdminHelpGuideLogin()
    this.itcAdminHelpGuide = new AdminHelpGuideIntercept()
    this.helpGuideHome = new HelpGuidesHome()
    this.manageArticle = new ManageArticle()
  }
  initColumnName = () => {
    cy.get('td').eq(0).as('title')
    cy.get('td').eq(1).as('manageBy')
    cy.get('td').eq(2).as('dateModified')
  }
  hasToolbarHeader() {
    cy.get('@toolbarHeader').within(($header) => {
      cy.wrap($header).get('.font-size-22').contains('Articles')
      cy.get('a > span').contains(Field.DELETE)
      cy.get('input').should('have.attr', 'placeholder', 'Search')
      cy.get('.btn-primary').should('contain.text', 'New article')
    })
  }
  checkArticleByName(article) {
    cy.cwRowName(article)
      .as('rowArticle')
      .within(() => {
        this.initColumnName()
        cy.get('@title').find('span').should('contain.text', article)
        this.showManageByAs()
        cy.get('@dateModified').find('div.dropdown').getThreeDots().should('be.visible')
      })
  }
  showManageByAs() {
    cy.get('@manageBy').within(($manageBy) => {
      $manageBy.text().includes('Platform') ? this.manageByPlatform() : this.manageByWebLearn()
    })
  }
  manageByPlatform() {
    cy.get('@manageBy').should('contain.text', 'Platform')
  }
  manageByWebLearn() {
    cy.get('@manageBy').should('contain.text', OrgConst.NAME)
  }
  hasLabelPromoted() {
    cy.get('@rowArticle').find('span.border.rounded-circle.bg-primary').contains('Promoted')
  }
  hasTag(tagName) {
    if (new Environment().isPrd() && tagName != 'Automate') {
      cy.get('@rowArticle')
        .children()
        .eq(0)
        .contains('label.border.text-uppercase.text-gray', tagName)
    }
  }
  onAction(action, article) {
    this.searchArticle(article)
    this.checkThreeDotsByRow(0)
    cy.rowName(article).getThreeDots().clickDropdownName(action)
  }
  initTable() {
    cy.cwTable('tableArticle', 'tableHeaderArticle')
    cy.getTableHeader('Title').minusCheckBox()
    cy.getTableHeader('Managed by')
    cy.getTableHeader('Date modified')
  }

  checkThreeDotsByRow(rowNumber) {
    cy.getTableRow(rowNumber).as('articleRow')
    cy.get('@articleRow').within(($articleRow) => {
      cy.wrap($articleRow).get('td').eq(2).as('dateModified')
      cy.get('@dateModified').find('div.dropdown').eq(1).getThreeDots().click()

      cy.get('@cwThreeDots').getDropdownList()
      cy.get('@cwDropDownList').should('have.length', 3)
      cy.get('@cwDropDownList').eq(0).as('edit')
      cy.get('@cwDropDownList').eq(1).as('promotion')
      cy.get('@cwDropDownList').eq(2).as('delete')
      cy.get('@edit').should('have.text', Field.EDIT)
      this.showDashboardTextAs('@promotion')
      cy.get('@delete').should('have.text', Field.DELETE)
    })
  }
  showDashboardTextAs(subject) {
    cy.get(subject).then(($dashboard) => {
      $dashboard.text().includes('Unpromote')
        ? this.UnPromoteDashboard(subject)
        : this.PromoteDashboard(subject)
    })
  }
  PromoteDashboard(subject) {
    cy.get(subject).should('have.text', 'Promote on Dashboard')
  }
  UnPromoteDashboard(subject) {
    cy.get(subject).should('have.text', 'Unpromote from Dashboard')
  }
  showDialogPromote() {
    cy.verifySwal2Confirmation(
      'Promote this article?',
      'This will replace the current promoted help guide for',
      Field.YES_PROMOTE,
      Field.CANCEL
    )
    cy.closeSwal2()
  }
  showDialogUnPromote() {
    cy.verifySwal2Confirmation(
      'Unpromote this article?',
      `This will remove the current promoted help guide for ${OrgConst.NAME}.`,
      Field.YES_UN_PROMOTE,
      Field.CANCEL
    )
    cy.closeSwal2()
  }
  showDialogDelete() {
    cy.verifySwal2Confirmation(
      'Delete this article?',
      Field.NOTE_THIS_ACTION_CANNOT_BE_UNDONE,
      Field.YES_DELETE,
      Field.CANCEL
    )
    cy.closeSwal2()
  }
  searchArticle(name) {
    this.itcAdminHelpGuide.interceptList()
    this.adminHelpGuide.initToolbarHeader()
    cy.get('@toolbarHeader').inputSearch().scrollIntoView().clear().type(`"${name}" {enter}`)
    this.itcAdminHelpGuide.waitList()
  }
  clickOptionThreeDots(rowNumber, optionName) {
    cy.getTableRow(rowNumber).as('articleRow')
    cy.get('@articleRow').within(($articleRow) => {
      cy.wrap($articleRow).get('td').eq(2).as('dateModified')
      cy.get('@dateModified').find('div.dropdown').eq(1).getThreeDots().as('threeDots')
      cy.get('@threeDots').click()
      cy.get('@threeDots').clickDropdownName(optionName)
    })
  }
  interceptEdit() {
    this._itcEdit.set()
  }
  waitEdit() {
    this._itcEdit.wait()
  }
  clickNewArticleButton() {
    this.adminModifyArticle.interceptEditor()
    this.adminHelpGuide.clickButtonInToolbarHeader('New article')
    this.adminModifyArticle.waitEditor(3000)
  }
  clickArticleName(name) {
    this.adminModifyArticle.interceptEditor()
    this.initRowAliasByName(name)
    cy.get('@articleRow').within(($topicRow) => {
      cy.wrap($topicRow)
        .find('td')
        .eq(0)
        .find('a', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true })
      this.adminModifyArticle.waitEditor()
    })
  }
  interceptUnPromote() {
    cy.intercept('*&_helpGuideAdminPortlet_promote=false*').as('getUnpromote')
  }
  interceptPromote() {
    cy.intercept('*&_helpGuideAdminPortlet_promote=true*').as('getPromote')
  }
  initRowAliasByName(articleName) {
    cy.get('@tableArticle').rowName(articleName).as('articleRow')
  }

  resetUnPromoteArticle(articleName) {
    this.initRowAliasByName(articleName)
    cy.get('@articleRow')
      .invoke('text')
      .then((text) => {
        if (text.includes('Promoted')) {
          this.unPromoteArticle(articleName)
        }
      })
  }
  resetPromoteArticle(articleName) {
    this.initRowAliasByName(articleName)
    cy.get('@articleRow')
      .invoke('text')
      .then((text) => {
        if (!text.includes('Promoted')) {
          this.promoteArticle(articleName)
        }
      })
  }
  promoteArticle(articleName) {
    this.itcAdminHelpGuide.interceptList()
    this.initRowAliasByName(articleName)
    cy.get('@articleRow').within(($articleRow) => {
      cy.wrap($articleRow).getThreeDots().click()
      cy.wrap($articleRow).clickDropdownName('Promote on Dashboard')
    })
    cy.swal2Confirm(Field.YES_PROMOTE).click()
    cy.wait('@getPromote')
    this.itcAdminHelpGuide.waitList()
  }
  unPromoteArticle(articleName) {
    this.initRowAliasByName(articleName)
    cy.get('@articleRow').within(($articleRow) => {
      cy.wrap($articleRow).getThreeDots().click()
      cy.wrap($articleRow).clickDropdownName('Unpromote from Dashboard')
    })
    cy.swal2Confirm(Field.YES_UN_PROMOTE).click()
    cy.wait('@getUnpromote')
    this.itcAdminHelpGuide.waitList()
  }
  clearSearch() {
    cy.get('@toolbarHeader').inputSearch().clear().type(`{enter}`)
    this.itcAdminHelpGuide.waitList()
  }
  verifyPromotedArticle(articleName, index = 0) {
    if (index == 0) {
      this.clearSearch()
    }
    cy.get('@tableArticle')
      .row()
      .eq(index)
      .within(($topRow) => {
        cy.wrap($topRow).contains(articleName)
        cy.wrap($topRow).contains('Promoted')
        cy.wrap($topRow).contains('About a minute ago.')
        cy.wrap($topRow).getThreeDots().click()
        cy.wrap($topRow)
          .getDropdownList()
          .should('contain.text', 'Unpromote from Dashboard')
          .should('not.contain.text', 'Promote on Dashboard')
      })
  }
  verifyUnPromotedArticle(articleName) {
    this.clearSearch()
    cy.get('@tableArticle')
      .row()
      .first()
      .within(($topRow) => {
        cy.wrap($topRow).contains(articleName)
        cy.wrap($topRow).should('not.contain.text', 'Promoted')
        cy.wrap($topRow).contains('About a minute ago.')
        cy.wrap($topRow).getThreeDots().click()
        cy.wrap($topRow)
          .getDropdownList()
          .should('contain.text', 'Promote on Dashboard')
          .should('not.contain.text', 'Unpromote from Dashboard')
      })
  }
  getImageSelectorIframeBody() {
    return cy
      .get(`#_helpGuideAdminPortlet_contextselectItem_iframe_`)
      .getIframeBody()
      .as('iframeBody')
  }
  clickRTEImageSelector(imageTitle) {
    cy.wait(3000) // wait for iframe element is ready
    cy.get('@imgSelectorContainer')
      .find(`.entry-card .card-interactive span[title='${imageTitle}']`)
      .parents('.card-type-asset')
      .click()
    this.expectImageLiferayModalNotExist()
  }
  clickPublishButton() {
    new ManageArticle().publish()
  }
  inputArticleTitle(articleTitle) {
    cy.get('#_helpGuideAdminPortlet_title').type(articleTitle)
  }
  selectDropdownOptionByIndex(index) {
    this.adminModifyArticle.interceptEditor()
    cy.get('#_helpGuideAdminPortlet_cw-dropdown_')
      .parent()
      .within(($cwDropdown) => {
        cy.wrap($cwDropdown)
          .getDropdownToggle()
          .then(($dropdown) => {
            cy.get($dropdown).click({ force: true })
          })
        cy.get(`.dropdown-menu > li:nth-child(${index})`).click()
        this.adminModifyArticle.waitEditor(3000)
      })
  }
  selectDropdownOptionByName(orgName = OrgConst.NAME) {
    this.adminModifyArticle.interceptEditor()
    cy.cardRightContent().clickCwDropdownItem(orgName)
  }
  closeChangeManageByWarning() {
    cy.get('.swal2-container .swal2-actions .swal2-cancel').click()
  }
  openImageSelector() {
    this.waitForRenderUi(1000)
    cy.get('#cke__helpGuideAdminPortlet_context').within(($editor) => {
      cy.wrap($editor)
        .get('.cke_button.cke_button__imageselector')
        .should('be.visible')
        .as('imageSelector')
      this.waitForRenderUi(3000)
      cy.get('@imageSelector').click()
    })
  }
  waitForRenderUi(time) {
    cy.wait(time)
  }
  uploadImageToRTE(imageTitle) {
    this.getImageSelectorContainer()
    this.clickRTEImageSelector(imageTitle)
  }
  resetArticle(articleTitle) {
    this.adminHelpGuideLogin.signInAsHelpGuideTwoOrgAdminToTab()
    this.searchArticle(articleTitle)
    cy.get('.table-responsive').then(($table) => {
      if ($table.find(`table tr:contains("${articleTitle}")`).length) {
        this.removeArticle(articleTitle)
      }
    })
  }
  removeArticle(title) {
    this.itcAdminHelpGuide.interceptList()
    cy.waitLoadingOverlayNotExist()
    cy.get(`.table-responsive table tr:contains("${title}")`)
      .first()
      .within(($newArticle) => {
        cy.wrap($newArticle).getThreeDots().click()
        cy.wrap($newArticle).clickDropdownName(Field.DELETE)
      })
    cy.get('button:contains("Yes, Delete")').click()
    this.itcAdminHelpGuide.waitList()
  }
  showManageByWarningModal() {
    cy.get('h2.swal2-title').contains('Changing who manages this article').should('be.visible')
  }
  getImageSelectorContainer() {
    this.openImageSelector()
    this.waitForRenderUi(10000)
    this.getImageSelectorIframeBody()
    cy.get('@iframeBody').within(($iframeBody) => {
      cy.wrap($iframeBody)
        .find('#main-content')
        .parent()
        .within(($sufaceDefault) => {
          cy.wrap($sufaceDefault)
            .get(
              '#_com_liferay_item_selector_web_portlet_ItemSelectorPortlet_repositoryEntriesSearchContainerSearchContainer'
            )
            .as('imgSelectorContainer')
        })
    })
  }
  expectImageLiferayModalNotExist() {
    cy.get('.liferay-modal').should('not.exist')
  }
}
export default ArticleListScreen
