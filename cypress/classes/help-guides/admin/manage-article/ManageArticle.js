import InterceptAction from '../../../base/InterceptAction'
import Field from '../../../constants/Field'
import { OrgConst } from '../../../org-management/base-org-management/OrgStub'
import SignInAs from '../../../utilities/SignInAs'
import AdminHelpGuideLogin from '../../base-help-guides/member-management/AdminHelpGuideLogin'
import AdminHelpGuide from '../AdminHelpGuide'
import ArticleListScreen from '../ArticleListScreen'
import ModifyArticle from '../ModifyArticle'

class ManageArticle extends AdminHelpGuide {
  #articleTitle
  #editHelpGuide = new InterceptAction('/help-guide/edit', 'EditHelpGuide')
  #modifyArticle = new ModifyArticle()

  constructor(articleTitle) {
    super()
    this.#articleTitle = articleTitle
    this.adminHelpGuideLogin = new AdminHelpGuideLogin()
  }

  setArticleTitle(name) {
    this.#articleTitle = name
  }

  newArticle() {
    cy.get('button:contains("New article")').click()
    Cypress.on('uncaught:exception', () => false)
  }

  expectPublishButtonDisabled() {
    cy.get('button:contains("Publish")').should('have.attr', 'disabled')
  }

  expectPublishButtonEnabled() {
    cy.get('button:contains("Publish")').should('not.have.attr', 'disabled')
  }

  selectOrganizationMember() {
    this.getOrgMemberVisibility().click()
  }

  getOrgMemberVisibility() {
    return cy.get('.radio-container:contains("Organization Members")')
  }

  selectOrganization() {
    cy.get('.category__name').contains(OrgConst.NAME).click()
  }

  createNewArticleWith(title) {
    this.newArticle()
    this.enterArticleTitle(title)
    this.publish()
  }

  removeArticle(title) {
    const articleListSreen = new ArticleListScreen()
    articleListSreen.searchArticle(title)
    cy.get(`.table-responsive table tr:contains("${title}")`)
      .first()
      .within(($newArticle) => {
        cy.wrap($newArticle).getThreeDots().click()
        cy.wrap($newArticle).clickDropdownName(Field.DELETE)
      })
    cy.intercept('**help-guide%2Fdelete-posts').as('deleteArticle')
    cy.get(`button:contains("${Field.YES_DELETE}")`).click()
    cy.wait('@deleteArticle')
  }

  removeAllArticles(title) {
    const articleSelector = `.table-responsive table tr:contains("${title}")`
    const articleListSreen = new ArticleListScreen()
    articleListSreen.searchArticle(title)
    cy.get('.article-list').then(($articleList) => {
      const totalItems = $articleList.find(articleSelector).length
      if (totalItems) {
        cy.get(articleSelector).then((rows) => {
          rows.toArray().forEach((element) => {
            cy.get(element).within(($articleRow) => {
              cy.wrap($articleRow).getCheckbox().check()
            })
          })
        })
        this.clickDeleteButton()
        cy.intercept('**help-guide%2Fdelete-posts').as('deleteArticle')
        cy.get(`button:contains("${Field.YES_DELETE}")`).click()
        cy.wait('@deleteArticle')
        this.clearSearchBox()
      }
    })
  }

  removeAllArticlesInAdminPageWith(title) {
    this.goToAdminPage()
    this.removeAllArticles(title)
  }

  removeUploadedVideo() {
    cy.get('.cec-mt-sm-n1 > .lexicon-icon').click()
  }

  expectArticleInAdminArticles(title) {
    this.getArticle(title).should('be.visible')
  }

  getArticle(title) {
    return cy.cwTable().rowName(title).first()
  }

  expectArticleNotInAdminArticles() {
    cy.get('.table-responsive table tr').should('not.contain.text', this.#articleTitle)
  }

  expectManageBy(name) {
    this.getArticle(name).within(($article) => {
      cy.wrap($article).get(':nth-child(2)').contains(name).should('be.visible')
    })
  }

  expectedUploadVideoDropzoneVisible() {
    cy.get('.cw-dropzone-drop-area').should('be.visible')
  }

  expectDuplicateArticleInAdminArticles(title) {
    this.itcAdminHelpGuide.interceptList()
    cy.get('#_helpGuideAdminPortlet_search').type(`"${title}" {enter}`)
    this.itcAdminHelpGuide.waitList()
    cy.wait(1000)
    cy.get(`.table-responsive table tr:contains("${title}")`).should('have.length', 2)
  }

  expectArticleInHomePage(title) {
    cy.get('.card > .card-body').contains(title).should('be.visible')
  }

  expectArticleNotInHomePage() {
    cy.get('.card > .card-body').should('not.contain.text', this.#articleTitle)
  }

  expectToHaveManageBySection() {
    this.getManagedBySection().should('be.visible')
  }

  getManagedBySection() {
    return cy.get('.cec-card__right-content .nav-item').contains('Managed by')
  }

  expectToHaveOrganizationVisibility() {
    this.getOrgMemberVisibility().should('be.visible')
  }

  expectNotHaveOrgVisibility() {
    this.getManagedBySection().parents('li').should('not.contain.text', 'Organization Members')
  }

  expectNotHaveManageBySection() {
    cy.get('.cec-card__right-content .nav-item').should('not.contain.text', 'Managed by')
  }

  goToHomePage() {
    cy.intercept('**help-guide%2Farticles%2Fsearch').as('fetchHomePageArticles')
    cy.visit('/web/help-guide/home')
    cy.wait('@fetchHomePageArticles')
  }

  goToAdminPage() {
    this.itcAdminHelpGuide.interceptList()
    cy.visit('/web/help-guide/admin')
    this.itcAdminHelpGuide.waitList()
  }

  publish() {
    this.#modifyArticle.initHeader()
    this.itcAdminHelpGuide.interceptList()
    this.#editHelpGuide.set()
    cy.get('@actionButton').contains(Field.PUBLISH).click()
    this.#editHelpGuide.wait()
    this.itcAdminHelpGuide.waitList()
  }

  enterArticleTitle(title) {
    cy.get('input[placeholder="Enter Title Here"]').type(title)
  }

  selectManagedByOrganization(name) {
    cy.get('#_helpGuideAdminPortlet_cw-dropdown_').click()
    cy.get('.dropdown-item').contains(name).click()
  }

  expectVideoArticleInArticlesHomePage(articleTitle) {
    this.goToHomePage()
    cy.get('.card > .card-body')
      .contains(articleTitle)
      .within(($articleCard) => {
        cy.wrap($articleCard).should('be.visible')
        cy.wrap($articleCard).parent('div').contains('Video').should('be.visible')
      })
  }

  expectVideoArticleInArticlesAdminPage(articleTitle) {
    cy.get(`.table-responsive table tr:contains("${articleTitle}")`).within(($newArticle) => {
      cy.wrap($newArticle).should('be.visible')
      cy.wrap($newArticle).get('.tag-categories-list').contains('Video').should('be.visible')
    })
  }

  #typeVideoUrl(url) {
    cy.inputByPlaceholder('Please enter your url here', url)
  }

  addYouTubeLink(url) {
    this.#typeVideoUrl(url)
  }

  addVimeoLink(url) {
    this.#typeVideoUrl(url)
  }

  uploadVideo(filePath) {
    cy.intercept('**help-guide%2Ftemp-file%2Fupload%2Fvideo').as('uploadVideo')
    cy.get('.radio-container').contains('Upload a video file').click()
    cy.get('.cw-dropzone-drop-area').attachFile(filePath, {
      encoding: 'utf-8',
      subjectType: 'drag-n-drop',
    })
    cy.wait('@uploadVideo')
  }

  enableIncludeVideo() {
    cy.get('.cec-mt-6 > .text-noselect > .cw-toggle-button > .switch > .slider').click()
  }

  selectCategory(name) {
    cy.get('.cec-card__right-content').within(($properties) => {
      cy.wrap($properties).get('.collapse-element').contains(name).click()
    })
  }

  adminSidebar(navItem) {
    cy.get('.cec-card__left-content').within(($adminSidebar) => {
      cy.wrap($adminSidebar).get('.nav').contains(navItem).click()
    })
  }

  expectCategoryWithArticleNumber(name, number) {
    cy.get('tbody')
      .invoke('text')
      .then((text) => {
        cy.wrap(text)
          .rowName(name)
          .within(($row) => {
            cy.wrap($row)
              .get('td:nth-child(2)')
              .invoke('text')
              .then((text) => {
                expect(parseInt(text.trim())).to.be.equal(number)
              })
          })
      })
  }

  verifyArticleManagedByOrganization(name, articleTitle) {
    this.expectArticleInAdminArticles(articleTitle)
    this.expectManageBy(name)
    this.goToHomePage()
    this.expectArticleInHomePage(articleTitle)

    SignInAs.reSignInAsCwNormalUser()
    this.goToHomePage()
    this.expectArticleNotInHomePage(articleTitle)

    SignInAs.reSignInAsOrgMember()
    this.goToHomePage()
    this.expectArticleInHomePage(articleTitle)

    SignInAs.reSignInAsHelpGuideAdmin()
    this.goToAdminPage()
    this.expectArticleNotInAdminArticles(articleTitle)
    this.goToHomePage()
    this.expectArticleNotInHomePage(articleTitle)

    SignInAs.reSignInAsOrgAdmin()
    this.goToAdminPage()
    this.expectArticleInAdminArticles(articleTitle)
    this.goToHomePage()
    this.expectArticleInHomePage(articleTitle)
  }
}

export default ManageArticle
