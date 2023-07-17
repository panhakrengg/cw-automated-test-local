import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import RecommendedHelpGuides from '../../../../../classes/dashboard/RecommendedHelpGuides'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Faker from '../../../../../classes/utilities/Faker'
import HelpGuideFixture from '../../../../../classes/utilities/HelpGuideFixture'

const helpGuideFixture = new HelpGuideFixture()
const articleListScreen = new ArticleListScreen()
const recommendedHelpGuides = new RecommendedHelpGuides()
const adminHelpGuideLogin = new AdminHelpGuideLogin()
const adminHelpGuide = new AdminHelpGuide()
const faker = new Faker()

let article,
  articleCreateCop,
  articleCreateCopBody,
  organizationMember,
  articleManageConsent,
  articleManageConsentBody

const setArticleFixtureData = (promotedArticle) => {
  article = helpGuideFixture.getArticleCreateCoPFromWebLearn(promotedArticle)
  articleCreateCop = article.title
  articleCreateCopBody = article.textBody
  organizationMember = article.organizationMember
}

describe(Epic.HelpGuides, { retries: 1 }, () => {
  beforeEach(() => {
    recommendedHelpGuides.interceptRecommended()
    articleListScreen.interceptPromote()
    articleListScreen.interceptUnPromote()
    helpGuideFixture.getPromotedArticleData()
  })
  it('Promoted articles in Organization "Create organization community of purpose"', () => {
    Story.ticket('QA-288')
    cy.get('@promotedArticle').then((promotedArticle) => {
      setArticleFixtureData(promotedArticle)

      describe('Sign in as Organization Admin', () => {
        adminHelpGuideLogin.signInAsOrgAdminToTab()
      })
      describe('Promote article', () => {
        articleListScreen.searchArticle(articleCreateCop)
        articleListScreen.resetUnPromoteArticle(articleCreateCop)
        articleListScreen.promoteArticle(articleCreateCop)
      })
      describe('Verify In Article List', () => {
        articleListScreen.verifyPromotedArticle(articleCreateCop)
      })
      describe('Organization Member can see article from organization', () => {
        cy.visitThenSignIn('/', organizationMember)
        recommendedHelpGuides.waitRecommended()
        recommendedHelpGuides.expectArticleCardWithData(articleCreateCop, articleCreateCopBody)
      })
    })
  })
  it('UnPromote article in Organization and has Promote article in Platform', () => {
    Story.ticket('QA-290')
    cy.get('@articleNameConsentForm').then((articleNameConsentForm) => {
      articleManageConsent = faker.getAuTextNotDelete(articleNameConsentForm)
    })
    cy.get('@articlePlatformDashboard').then((articlePlatformDashboard) => {
      articleManageConsentBody = articlePlatformDashboard.body.value
    })
    cy.get('@promotedArticle').then((promotedArticle) => {
      setArticleFixtureData(promotedArticle)

      describe('Sign In As Organization Admin', () => {
        adminHelpGuideLogin.signInAsOrgAdminToTab()
      })
      describe('UnPromote article in WebLearn', () => {
        articleListScreen.resetPromoteArticle(articleCreateCop)
        articleListScreen.unPromoteArticle(articleCreateCop)
      })
      describe('Verify In Article List', () => {
        adminHelpGuide.initToolbarHeader()
        articleListScreen.verifyUnPromotedArticle(articleCreateCop)
      })
      describe('Organization Member can see only article from platform', () => {
        cy.visitThenSignIn('/', organizationMember)
        recommendedHelpGuides.waitRecommended()
        recommendedHelpGuides.expectTotalArticle(1)
        recommendedHelpGuides.expectArticleCardWithData(
          articleManageConsent,
          articleManageConsentBody
        )
        recommendedHelpGuides.unExpectArticleCardWithData(articleCreateCop, articleCreateCopBody)
      })
      describe('Reset data', () => {
        adminHelpGuideLogin.signInAsAdminAndOrgAdminToTab()
        articleListScreen.searchArticle(articleCreateCop)
        articleListScreen.resetPromoteArticle(articleCreateCop)
      })
    })
  })
})
