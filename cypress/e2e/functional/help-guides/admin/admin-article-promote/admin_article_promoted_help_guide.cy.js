import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import RecommendedHelpGuides from '../../../../../classes/dashboard/RecommendedHelpGuides'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Faker from '../../../../../classes/utilities/Faker'
import HelpGuideFixture from '../../../../../classes/utilities/HelpGuideFixture'

const adminHelpGuideLogin = new AdminHelpGuideLogin()
const helpGuideFixture = new HelpGuideFixture()
const faker = new Faker()
const articleListScreen = new ArticleListScreen()
const recommendedHelpGuides = new RecommendedHelpGuides()

describe(Epic.HelpGuides, { retries: 1 }, () => {
  beforeEach(() => {
    recommendedHelpGuides.interceptRecommended()
    articleListScreen.interceptPromote()
    articleListScreen.interceptUnPromote()
    helpGuideFixture.getPromotedArticleData()
  })

  context(Story.adminArticlePromotedHelpGuide, () => {
    it('Unpromote article in Platform "Managing Your Accepted Consent Forms"', () => {
      Story.ticket('QA-287')
      cy.get('@articleNameConsentForm').then((articleNameConsentForm) => {
        const articleManageConsent = faker.getAuTextNotDelete(articleNameConsentForm)

        describe('Sign in as admin', () => {
          adminHelpGuideLogin.signInAsAdminToTab()
        })
        describe('Unpromote article', () => {
          articleListScreen.searchArticle(articleManageConsent)
          articleListScreen.resetPromoteArticle(articleManageConsent)
          articleListScreen.unPromoteArticle(articleManageConsent)
        })
        describe('Verify In Article List', () => {
          articleListScreen.verifyUnPromotedArticle(articleManageConsent)
        })
        describe('Verify In Dashboard By Crosswired User', () => {
          cy.get('@articlePlatformDashboard').then((articlePlatformDashboard) => {
            const crosswiredUser = articlePlatformDashboard.viewBy.crosswiredUser
            const articleManageConsentBody = articlePlatformDashboard.body.value

            cy.visitThenSignIn('/', crosswiredUser)
            recommendedHelpGuides.waitRecommended()
            recommendedHelpGuides.expectArticleCardWithData(
              articleManageConsent,
              articleManageConsentBody
            )
          })
        })
      })
    })
    it('Promoted articles in Platform "Managing Your Accepted Consent Forms"', () => {
      Story.ticket('QA-286')
      cy.get('@articleNameConsentForm').then((articleNameConsentForm) => {
        const articleManageConsent = faker.getAuTextNotDelete(articleNameConsentForm)

        describe('Sign in as admin', () => {
          adminHelpGuideLogin.signInAsAdminToTab()
        })
        describe('Promote article', () => {
          articleListScreen.searchArticle(articleManageConsent)
          articleListScreen.resetUnPromoteArticle(articleManageConsent)
          articleListScreen.promoteArticle(articleManageConsent)
        })
        describe('Verify In Article List', () => {
          articleListScreen.verifyPromotedArticle(articleManageConsent)
        })
        describe('Verify In Dashboard By Crosswired User', () => {
          cy.get('@articlePlatformDashboard').then((articlePlatformDashboard) => {
            const crosswiredUser = articlePlatformDashboard.viewBy.crosswiredUser
            const articleManageConsentBody = articlePlatformDashboard.body.value

            cy.visitThenSignIn('/', crosswiredUser)
            recommendedHelpGuides.waitRecommended()
            recommendedHelpGuides.expectArticleCardWithData(
              articleManageConsent,
              articleManageConsentBody
            )
          })
        })
        describe('Verify In Dashboard By Organization Member', () => {
          cy.get('@articlePlatformDashboard').then((articlePlatformDashboard) => {
            const orgMember = articlePlatformDashboard.viewBy.organizationMember
            const articleManageConsentBody = articlePlatformDashboard.body.value

            cy.visitThenSignIn('/', orgMember)
            recommendedHelpGuides.waitRecommended()
            recommendedHelpGuides.expectArticleCardWithData(
              articleManageConsent,
              articleManageConsentBody
            )
          })
        })
      })
    })
  })
})
