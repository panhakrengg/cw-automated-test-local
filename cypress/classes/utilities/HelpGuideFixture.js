import Faker from './Faker'
const YAML = require('yamljs')

class HelpGuideFixture {
  faker = new Faker()

  getData() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((helpGuideString) => {
      const helpGuide = YAML.parse(helpGuideString).HelpGuide
      cy.wrap(helpGuide).as('helpGuide')
      cy.wrap(helpGuide.admin).as('helpGuideAdmin')
      cy.wrap(helpGuide.home).as('helpGuideHome')
    })
  }
  getManageTopicData() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((topicString) => {
      const manageTopic = YAML.parse(topicString).ManageTopic
      cy.wrap(manageTopic).as('manageTopic')
      cy.wrap(manageTopic.admin.topics).as('manageTopicAdmin')
      cy.wrap(manageTopic.home.topics).as('manageTopicHome')
    })
  }
  getHelpGuideFilterData() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((helpGuideFilterString) => {
      const filterCriteria = YAML.parse(helpGuideFilterString).FilterSearch.home
      cy.wrap(filterCriteria.viewBy.organizationMember).as('orgMember')
      cy.wrap(filterCriteria.topics.name.value[0]).as('topicsSecurity')
      cy.wrap(filterCriteria.roles.name.value[0]).as('roleTrainers')
      cy.wrap(filterCriteria.roles.name.value[1]).as('roleCommunityAdmins')
      cy.wrap(filterCriteria.articles.searchByName.name.value[0]).as('articleNameConsentForm')
      cy.wrap(filterCriteria.articles.searchByName.results.value).as('searchNameResults')
      cy.wrap(filterCriteria.articles.searchByContent.content.value[0]).as('contentExpectedResult')
      cy.wrap(filterCriteria.articles.searchByContent.results.value).as('searchContentResults')
    })
  }
  getArticleDetailData() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((articleDetailString) => {
      const fakerCriteria = new Faker()
      const articleDetailsCriteria = YAML.parse(articleDetailString).ArticleDetails
      fakerCriteria.setPathFixture(articleDetailsCriteria.article)
      fakerCriteria.getFixtureUrlId(0, 'articleUrlIdHasTag')
      fakerCriteria.getFixtureUrlId(1, 'articleUrlIdNoTag')
      cy.wrap(articleDetailsCriteria.viewBy.organizationMember).as('orgMember')
      cy.wrap(articleDetailsCriteria.article.name.value[0]).as('articleTitleHasTag')
      cy.wrap(articleDetailsCriteria.article.name.value[1]).as('articleTitleNoTag')
      cy.wrap(articleDetailsCriteria.article.tag.name.value).as('articleTags')
    })
  }
  getManageRoleData() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((roleString) => {
      const manageRole = YAML.parse(roleString).ManageRole
      cy.wrap(manageRole).as('manageRole')
      cy.wrap(manageRole.admin.roles).as('manageRoleAdmin')
      cy.wrap(manageRole.home.roles).as('manageRoleHome')
    })
  }
  getPromotedArticleData() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((promotedString) => {
      const promotedArticle = YAML.parse(promotedString).PromotedArticle
      const articlePlatformAdmin = promotedArticle.platform.admin.article
      const articleWebLearnAdmin = promotedArticle.webLearn.admin.article
      const articlePlatformDashboard =
        promotedArticle.platform.dashboard.recommendedHelpGuide.article
      const articleWebLearnDashboard =
        promotedArticle.webLearn.dashboard.recommendedHelpGuide.article

      cy.wrap(promotedArticle).as('promotedArticle')
      cy.wrap(articlePlatformAdmin.label).as('articlesLabel')
      cy.wrap(articlePlatformAdmin.modifyBy.helpGuideAdmin).as('helpGuideAdmin')
      cy.wrap(articlePlatformAdmin.name.value).as('articleNameConsentForm')
      cy.wrap(articlePlatformDashboard).as('articlePlatformDashboard')
      cy.wrap(articleWebLearnDashboard).as('articleWebLearnDashboard')
      cy.wrap(articleWebLearnAdmin.name.value).as('articleNameCreateCop')
    })
  }
  getCopyLinkArticleData() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((copyLinkString) => {
      const fakerCriteria = new Faker()
      const copyLink = YAML.parse(copyLinkString).CopyLink
      const platform = copyLink.platform
      const webLearn = copyLink.webLearn

      fakerCriteria.setPathFixture(platform.articleDetail)
      fakerCriteria.getFixtureUrlId(0, 'articlePlatform')
      fakerCriteria.setPathFixture(webLearn.articleDetail)
      fakerCriteria.getFixtureUrlId(0, 'articleWebLearn')
      cy.wrap(platform.viewBy.crosswiredUser).as('crosswiredUser')
      cy.wrap(webLearn.viewBy.organizationMember).as('orgMember')
      cy.wrap(platform.articleDetail.name.value).as('articleTitlePlatform')
      cy.wrap(webLearn.articleDetail.name.value).as('articleTitleWebLearn')
    })
  }
  getPlayVideoData() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((playVideoString) => {
      const fakerCriteria = new Faker()
      const playVideo = YAML.parse(playVideoString).PlayVideo
      fakerCriteria.setPathFixture(playVideo.youtube.article)
      fakerCriteria.getFixtureUrlId(0, 'articleIdForYoutubeVideo')
      cy.wrap(playVideo.youtube.title).as('youtubeTitle')

      fakerCriteria.setPathFixture(playVideo.vimeo.article)
      fakerCriteria.getFixtureUrlId(0, 'articleIdForVimeoVideo')
      cy.wrap(playVideo.vimeo.title).as('vimeoTitle')

      fakerCriteria.setPathFixture(playVideo.uploadedVideo.article)
      fakerCriteria.getFixtureUrlId(0, 'articleIdForUploadVideo')

      cy.wrap(playVideo.viewBy.organizationMember).as('orgMember')
    })
  }
  articleFromPlatform(article) {
    const platform = article.platform
    let title = this.faker.getAuTextNotDelete(platform.admin.article.name.value)
    const dashboardPlatform = platform.dashboard.recommendedHelpGuide.article
    let crosswiredUser = dashboardPlatform.viewBy.crosswiredUser
    let textBody = dashboardPlatform.body.value

    return { title, textBody, crosswiredUser }
  }
  getArticleCreateCoPFromWebLearn(article) {
    const webLearn = article.webLearn
    let title = webLearn.admin.article.name.value
    const dashboardWebLearn = webLearn.dashboard.recommendedHelpGuide.article
    let organizationMember = dashboardWebLearn.viewBy.organizationMember
    let textBody = dashboardWebLearn.body.value

    return { title, textBody, organizationMember }
  }
}
export default HelpGuideFixture
