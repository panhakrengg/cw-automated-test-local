import InterceptReq from '../../base/InterceptReq'
import Faker from '../../utilities/Faker'
import HelpGuideFixture from '../../utilities/HelpGuideFixture'

class HelpGuidesHome extends HelpGuideFixture {
  articleChangeEmail = `Change email (has video file)`
  articleCreateOrgCoP = `Create organization community of purpose`
  articleInviteUserOrg = `Invite user to organization (has youtube)`
  articleCourseCategory = `Create a course with category`
  faker
  _itcFilter = new InterceptReq('/help-guide/home-filter/options/fetch', 'Filter')
  _itcSearchArticle = new InterceptReq('/help-guide/articles/search', 'SearchArticle')
  _itcGetRelatedArticle = new InterceptReq('/related_article/get', 'GetRelatedArticle')

  constructor() {
    super()
    this.faker = new Faker()
  }

  interceptFilter() {
    this._itcFilter.set()
  }
  waitFilter() {
    this._itcFilter.wait()
  }

  interceptSearchArticle() {
    this._itcSearchArticle.set()
  }
  waitSearchArticle() {
    this._itcSearchArticle.wait()
  }

  showDefaultTenArticles() {
    cy.get('#_helpGuidePortlet_helpGuide > .row > div').find('.card-body').should('have.length', 10)
  }

  bannerWithoutData() {
    cy.get('.help-guide-banner-wrapper').within(($banner) => {
      cy.wrap($banner).find('h1.font-size-36').should('be.visible')
      cy.wrap($banner).find('p.font-size-16').should('be.visible')
      cy.wrap($banner).find('img.image__item').should('be.visible')
    })
  }

  bannerWithData(title, description) {
    cy.get('.help-guide-banner-wrapper').within(($banner) => {
      cy.wrap($banner).find('h1.font-size-36').contains(title)
      cy.wrap($banner).find('p.font-size-16').contains(description)
      cy.wrap($banner).find('img.image__item').should('be.visible')
    })
  }

  signInBy(role) {
    cy.visitThenSignIn('web/help-guide', role)
  }

  open(path, role) {
    cy.visitThenSignIn(path, role)
  }

  visitThenViewBannerModified(userRole = '') {
    this.getData()
    cy.get('@helpGuideHome').then((helpGuideHome) => {
      const banner = helpGuideHome.banner.data

      cy.visitThenSignIn(helpGuideHome.url, userRole)
      this.bannerWithData(banner.pageTitle.value, banner.shortDescription.value)
    })
  }

  viewWholePage() {
    this.waitFilter()

    cy.location('pathname').should('contain', '/web/help-guide')

    this.bannerWithoutData()
    this.hasNavigationWrapper()

    this.showDefaultTenArticles()
  }

  waitPage() {
    this.waitFilter()
    this.hasNavigationWrapper()
  }

  initNavigationWrapper() {
    cy.get('.navigation-wrapper').as('navigationWrapper')
    cy.get('@navigationWrapper').within(($nav) => {
      cy.wrap($nav)
        .find('.cw-dropdown')
        .eq(0)
        .contains('Roles')
        .parents('.cw-dropdown')
        .as('rolesDropdown')
    })
    cy.get('@navigationWrapper').within(($nav) => {
      cy.wrap($nav)
        .find('.cw-dropdown')
        .eq(1)
        .contains('Topics')
        .parents('.cw-dropdown')
        .as('topicsDropdown')
    })
    cy.get('@navigationWrapper').within(($nav) => {
      cy.wrap($nav).find('button').contains('Clear Filters').as('clearFilterButton')
    })
    cy.get('@navigationWrapper').within(($nav) => {
      cy.wrap($nav).find('.search-wrapper').as('searchWrapper')
    })
    cy.get('@searchWrapper').find('form > input').as('searchInputField')
    cy.get('@searchWrapper').find('button:contains(Search)').as('searchButton')
  }

  hasNavigationWrapper() {
    this.initNavigationWrapper()
    cy.get('@rolesDropdown').should('be.visible')
    cy.get('@topicsDropdown').should('be.visible')
    cy.get('@clearFilterButton').should('be.visible')
    cy.get('@searchWrapper').find('button.search-icon').should('be.visible')
    cy.get('@searchInputField').should('have.attr', 'placeholder', 'Search by keyword')
    cy.get('@searchButton').should('be.visible')
  }

  initBigCardDisplay(subject) {
    cy.get(subject).children().first().as('firstBigCard')
    cy.get('@firstBigCard').find('figure:nth-child(1)').as('leftSide')
    cy.get('@firstBigCard').find('figure + div').as('rightSide')
  }

  initStandardDisplay(subject) {
    if (this.isFoundBigRowCard(subject)) {
      cy.get(subject).first().next().as('firstStandardArticle')
    } else {
      cy.get(subject).first().as('firstStandardArticle')
    }
    cy.get('@firstStandardArticle').next().as('secondStandardArticle')
    cy.get('@secondStandardArticle').next().as('thirdStandardArticle')
  }

  checkBigCardArticle() {
    cy.get('#_helpGuidePortlet_helpGuide > .row > div').then(($card) => {
      if (this.isFoundBigRowCard($card)) {
        this.initBigCardDisplay($card)
        cy.wrap($card)
          .get('div[class="col-12 mb-sm-4"]')
          .within(($cardArticle) => {
            this.showImage('@leftSide')
            this.showContent('@rightSide')
            this.articleImage($cardArticle)
            this.showProvidedTag($cardArticle)
            this.checkDefaultVideoTag($cardArticle)
            this.articleDescriptive($cardArticle)
          })
      }
    })
  }

  checkStandardArticle() {
    cy.get('#_helpGuidePortlet_helpGuide > .row > div').then(($card) => {
      this.initStandardDisplay($card)
      this.showThreeArticleOneRow()
    })
  }

  showThreeArticleOneRow() {
    let threeColumnCardClass = 'col-md-4'
    cy.get('@firstStandardArticle')
      .should('contain.class', 'col-12')
      .and('contain.class', threeColumnCardClass)
    cy.get('@secondStandardArticle')
      .should('contain.class', 'col-12')
      .and('contain.class', threeColumnCardClass)
    cy.get('@thirdStandardArticle')
      .should('contain.class', 'col-12')
      .and('contain.class', threeColumnCardClass)
  }

  showCardArticle(title) {
    cy.get('#_helpGuidePortlet_helpGuide > .row > div').then(($card) => {
      if (title == this.articleChangeEmail) {
        this.articleCardTag($card, 'Video')
        this.articleCardTag($card, this.faker.getAuTextNotDelete('Trainers'))
        this.articleCardTag($card, this.faker.getAuTextNotDelete('Security'))
        this.articleCardImage($card, title)
      }
      if (title == this.articleCourseCategory) {
        let contentStartWith = 'Steps'
        this.articleCardTag($card, this.faker.getAuTextNotDelete('Learning Management'))
        this.articleCardTag($card, this.faker.getAuTextNotDelete('Learning Admins'))
        this.articleCardContent($card, title, contentStartWith)
      }

      if (title == this.articleCreateOrgCoP) {
        this.articleCardTag($card, this.faker.getAuTextNotDelete('Communities of Purpose'))
        this.articleCardTag($card, this.faker.getAuTextNotDelete('Learning Admins'))
        this.articleCardImage($card, title)
      }
      if (title == this.articleInviteUserOrg) {
        this.articleCardTag($card, 'Video')
        this.articleCardTag($card, this.faker.getAuTextNotDelete('Security'))
        this.articleCardTag($card, this.faker.getAuTextNotDelete('Learning Admins'))
        this.cardVideoType($card, title)
      }
    })
  }

  initStandardCard() {
    cy.get('.row')
      .find(`.col-md-4 > div.card`)
      .first()
      .within(($standardCard) => {
        cy.wrap($standardCard).as('standardCard')
        cy.wrap($standardCard).as('standardCardImage')
        cy.wrap($standardCard).cardBody().children().first().as('standardCardTag')
        cy.get('@standardCardTag').next().as('standardCardTitle')
      })
  }

  checkArticleFeatureImgRender(article) {
    this.initStandardCard()
    this.showImage('@standardCardImage')
    this.showProvidedTags('@standardCardTag')
    this.showTitleByBlock('@standardCardTitle', article)
  }

  checkArticleVideoTypeRender(article) {
    this.initStandardCard()
    this.showVideoPlayIcon('@standardCardImage')
    this.showProvidedTags('@standardCardTag')
    this.showTitleByBlock('@standardCardTitle', article)
  }

  checkArticleWithoutImgRender(article) {
    let startDescription = 'Steps'
    this.initStandardCard()
    cy.get('@standardCardTitle').next().as('verticalCardDescription')
    this.notShowImage('@standardCardImage')
    this.showProvidedTags('@standardCardTag')
    this.showTitleByBlock('@standardCardTitle', article)
    this.showDescription('@verticalCardDescription', startDescription)
  }

  ableToViewInviteUserOrg(title) {
    cy.get('#_helpGuidePortlet_helpGuide > .row > div').then(($card) => {
      this.articleCardTag($card, this.faker.getAuTextNotDelete('Learning Admins'))
      this.articleCardTag($card, this.faker.getAuTextNotDelete('Security'))
      this.articleCardTag($card, this.faker.getAuTextNotDelete('Automate'))
      this.cardVideoType($card, title)
    })
  }

  clickStandardArticle(article) {
    this.initStandardCard()
    cy.get('@standardCardTitle')
      .contains('.font-weight-bold.text-black.multi-line-text-ellipsis-three', article)
      .click()
  }

  checkArticleFeatureImgRender(article) {
    this.initStandardCard()
    this.showImage('@standardCardImage')
    this.showProvidedTags('@standardCardTag')
    this.showTitleByBlock('@standardCardTitle', article)
  }

  checkArticleVideoTypeRender(article) {
    this.initStandardCard()
    this.showVideoPlayIcon('@standardCardImage')
    this.showProvidedTags('@standardCardTag')
    this.showTitleByBlock('@standardCardTitle', article)
  }

  checkArticleWithoutImgRender(article) {
    let startDescription = 'Steps'
    this.initStandardCard()
    cy.get('@standardCardTitle').next().as('verticalCardDescription')
    this.notShowImage('@standardCardImage')
    this.showProvidedTags('@standardCardTag')
    this.showTitleByBlock('@standardCardTitle', article)
    this.showDescription('@verticalCardDescription', startDescription)
  }

  emptyResult() {
    cy.get('#_helpGuidePortlet_helpGuide > .text-center').within(($emptyResult) => {
      cy.wrap($emptyResult).hasSvgIcon().should('be.exist')
      cy.wrap($emptyResult).contains('p', 'No results').and('be.visible')
    })
  }

  searchArticleByEnter(article) {
    this.interceptSearchArticle()
    this.initNavigationWrapper()
    cy.get('@searchInputField').clear().type(`"${article}" {enter}`)
    this.waitSearchArticle()
  }

  searchArticleBySearchButton(article) {
    this.interceptSearchArticle()
    this.initNavigationWrapper()
    cy.get('@searchInputField').clear().type(`"${article}"`)
    cy.get('@searchButton').click()
    this.waitSearchArticle()
  }

  clickClearSearch() {
    cy.get('@searchInputField').parent().next().click()
    this.waitSearchArticle()
  }

  displaySearchResultFor(article, resultNumber) {
    cy.get('#_helpGuidePortlet_helpGuide')
      .find(`:contains(Results for)`)
      .should('contain.text', `Results for ""${article}"": ${resultNumber}`)
  }

  showImage(subject) {
    cy.get(subject).should('have.descendants', 'img').and('be.visible')
  }

  notShowImage(subject) {
    cy.get(subject).should('not.have.descendants', 'img')
  }

  showVideoPlayIcon(subject) {
    this.showImage(subject)
    cy.get(subject).within(($subject) => {
      cy.wrap($subject).hasSvgIcon().should('be.exist')
    })
  }

  showTitleByBlock(subject, title) {
    cy.get(subject).should('contain.text', title).and('be.visible')
  }

  showProvidedTags(subject) {
    cy.get(subject).then(($subject) => {
      this.showProvidedTag($subject)
    })
  }

  showContent(subject) {
    cy.get(subject).should('contain.descendants', 'a').and('contain.descendants', 'p')
  }

  showDescription(subject, content) {
    cy.get(subject).contains('p', content).should('be.visible')
  }

  isFoundProvideTag(subject) {
    return subject.find('label.border.text-uppercase.text-gray').length
  }

  isFoundBigRowCard(subject) {
    return subject.find('div.card.cursor-pointer.featured').length
  }

  isFoundVideoIcon(subject) {
    return subject.find('> div.card > figure > svg').length
  }

  articleImage(subject) {
    cy.wrap(subject).find('> div.card > figure > img').should('be.exist')
    if (this.isFoundVideoIcon(subject)) {
      cy.wrap(subject).find('> div.card > figure > svg').should('be.exist')
    }
  }

  articleDescriptive(subject) {
    cy.wrap(subject)
      .cardBody()
      .within(($cardBody) => {
        this.displayTitle($cardBody)
        this.checkIsDisplayContent($cardBody)
      })
  }

  displayTitle(subject) {
    cy.wrap(subject).cardTitle().first().should('be.visible')
  }

  checkIsDisplayContent(subject) {
    cy.wrap(subject)
      .cardContent()
      .then(($content) => {
        if ($content.text().trim()) {
          cy.get($content).should('be.visible')
        }
      })
  }

  showTitle(subject, text) {
    cy.wrap(subject)
      .cardBody()
      .cardTitle()
      .contains('.font-weight-bold.text-black.multi-line-text-ellipsis-three', text)
      .should('be.visible')
  }
  checkContentAs(subject, text) {
    cy.wrap(subject)
      .cardBody()
      .cardContent()
      .contains('.text-gray-darker.multi-line-text-ellipsis-five', text)
      .should('be.visible')
  }

  displayTruncateSymbol(subject) {
    let TRUNCATE_SYMBOL = '...'
    cy.wrap(subject).cardBody().cardContent().contains(TRUNCATE_SYMBOL).should('be.visible')
  }

  articleCardContent(subject, title, content) {
    cy.get(subject).within(($cardContent) => {
      this.showTitle($cardContent, title)
      this.checkContentAs($cardContent, content)
    })
  }

  articleCardImage(subject, title) {
    cy.get(subject).within(($cardImage) => {
      this.articleImage($cardImage)
      this.showTitle($cardImage, title)
    })
  }

  cardVideoType(subject, title) {
    cy.get(subject).within(($cardVideo) => {
      this.articleImage($cardVideo)
      this.showTitle($cardVideo, title)
      this.checkDefaultVideoTag($cardVideo)
    })
  }

  articleCardTag(subject, tagName) {
    cy.wrap(subject)
      .cardBody()
      .within(($articleCard) => {
        cy.wrap($articleCard)
          .children('div')
          .contains('label.border.text-uppercase.text-gray', tagName)
          .and('be.visible')
      })
  }
  showProvidedTag(subject) {
    if (this.isFoundProvideTag(subject)) {
      cy.wrap(subject)
        .cardBody()
        .within(($articleCard) => {
          cy.wrap($articleCard)
            .children('div:first')
            .get('label.border.text-uppercase.text-gray')
            .should('be.exist')
        })
    }
  }
  checkDefaultVideoTag(subject) {
    if (this.isFoundVideoIcon(subject)) {
      this.articleCardTag(subject, 'Video')
    }
  }
  tagUpdated(article, tag) {
    cy.cardBody().within(($card) => {
      cy.wrap($card)
        .contains(article)
        .parents('.card-body')
        .within(($article) => {
          cy.wrap($article).find('.border.text-uppercase').contains(tag)
        })
    })
  }

  tagDeleted(article, tag) {
    cy.cardBody().within(($card) => {
      cy.wrap($card)
        .contains(article)
        .parents('.card-body')
        .within(($article) => {
          cy.wrap($article).find('.border.text-uppercase').should('not.contain.text', tag)
        })
    })
  }
  clickRolesDropdown() {
    this.initNavigationWrapper()
    cy.get('@navigationWrapper').clickCwDropdown('Roles')
  }
  clickTopicsDropdown() {
    this.initNavigationWrapper()
    cy.get('@navigationWrapper').within(($filter) => {
      cy.wrap($filter).clickCwDropdown('Topics')
    })
  }
  hasValue(subject, value) {
    cy.get(subject)
      .find('.dropdown-menu')
      .within(($dropdownMenu) => {
        cy.wrap($dropdownMenu)
          .find('a > span')
          .contains(value)
          .scrollIntoView()
          .should('be.visible')
      })
  }
  noValue(subject, value) {
    cy.get(subject)
      .find('.dropdown-menu')
      .within(($dropdownMenu) => {
        cy.wrap($dropdownMenu).find('a > span').should('not.contain.text', value)
      })
  }
  visit() {
    cy.visit('/web/help-guide/home')
    this.waitFilter()
  }
  visitFirstBeforePastLink() {
    this.visit()
  }
  expectedDisabledClearFilterButton() {
    this.initNavigationWrapper()
    cy.get('@clearFilterButton').should('be.disabled')
  }
  expectedFilterContainValue(subject, value) {
    cy.get(subject).within(($subject) => {
      this.hasValue($subject, value)
    })
  }
  selectFilterOptionByIndex(subject, index) {
    cy.get(subject).find(`.dropdown-menu > :nth-child(${index}) > .dropdown-item`).click()
  }
  selectFilterOptionByName(subject, name) {
    cy.get(subject).within(() => {
      cy.clickDropdownName(name)
    })
  }
  expectedFilterShowTotalSelectedItems(subject) {
    cy.get(subject).within((subject) => {
      cy.wrap(subject)
        .find('div[data-toggle="tooltip"]')
        .contains('span', 'selected')
        .should('be.visible')
    })
  }
  clickArticle(title) {
    this._itcGetRelatedArticle.set()
    this.searchArticleByEnter(title)
    cy.get(`a:contains('${title}')`).click()
    this._itcGetRelatedArticle.wait()
  }
  clickOnHelpGuideLink() {
    cy.cecCard().cardRightContent().find('strong:contains("Help Guide.")').click()
  }
}
export default HelpGuidesHome
