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

let articleManageConsent,
  articleManageConsentBody,
  articleCreateCop,
  articleCreateCopBody,
  crosswiredUser,
  organizationMember

const promotedArticleData = (articleObject) => {
  articleFromPlatform(articleObject)
  articleFromWebLearn(articleObject)
}
const articleFromPlatform = (articleObject) => {
  const platform = articleObject.platform
  articleManageConsent = faker.getAuTextNotDelete(platform.admin.article.name.value)

  const dashboardPlatform = platform.dashboard.recommendedHelpGuide.article
  crosswiredUser = dashboardPlatform.viewBy.crosswiredUser
  articleManageConsentBody = dashboardPlatform.body.value
}
const articleFromWebLearn = (articleObject) => {
  const webLearn = articleObject.webLearn
  articleCreateCop = webLearn.admin.article.name.value

  const dashboardWebLearn = webLearn.dashboard.recommendedHelpGuide.article
  organizationMember = dashboardWebLearn.viewBy.organizationMember
  articleCreateCopBody = dashboardWebLearn.body.value
}

describe(Epic.HelpGuides, { retries: 1 }, () => {
  beforeEach(() => {
    recommendedHelpGuides.interceptRecommended()
    articleListScreen.interceptPromote()
    articleListScreen.interceptUnPromote()
    helpGuideFixture.getPromotedArticleData()
  })

  context(Story.adminArticlePromotedHelpGuide, () => {
    it('Unpromote article in Organization and No Promote article in Platform', () => {
      Story.ticket('QA-291')
      cy.get('@promotedArticle').then((promotedArticle) => {
        promotedArticleData(promotedArticle)

        describe('Precondition: No Promote article in Platform', () => {
          adminHelpGuideLogin.signInAsAdminAndOrgAdminToTab()
          articleListScreen.searchArticle(articleManageConsent)
          articleListScreen.resetUnPromoteArticle(articleManageConsent)
        })
        describe('Sign In As Organization Admin', () => {
          adminHelpGuideLogin.signInAsOrgAdminToTab()
        })
        describe('Unpromote article in WebLearn', () => {
          articleListScreen.resetPromoteArticle(articleCreateCop)
          articleListScreen.unPromoteArticle(articleCreateCop)
        })
        describe('Organization Member can see only article from webLearn', () => {
          cy.visitThenSignIn('/', organizationMember)
          recommendedHelpGuides.waitRecommended()
          recommendedHelpGuides.expectTotalArticle(1)
          recommendedHelpGuides.expectArticleCardWithData(articleCreateCop, articleCreateCopBody)
          recommendedHelpGuides.unExpectArticleCardWithData(
            articleManageConsent,
            articleManageConsentBody
          )
        })
        describe('Reset data', () => {
          adminHelpGuideLogin.signInAsAdminAndOrgAdminToTab()
          articleListScreen.searchArticle(articleManageConsent)
          articleListScreen.resetPromoteArticle(articleManageConsent)
          articleListScreen.searchArticle(articleCreateCop)
          articleListScreen.resetPromoteArticle(articleCreateCop)
        })
      })
    })

    it('Promoted articles in Organization and Platform', () => {
      Story.ticket('QA-289')
      cy.get('@promotedArticle').then((promotedArticle) => {
        promotedArticleData(promotedArticle)

        describe('Sign in as Help Guide-Organization Admin', () => {
          adminHelpGuideLogin.signInAsAdminAndOrgAdminToTab()
        })
        describe('Promote article in Platform "Managing Your Accepted Consent Forms"', () => {
          articleListScreen.searchArticle(articleManageConsent)
          articleListScreen.resetUnPromoteArticle(articleManageConsent)
          articleListScreen.promoteArticle(articleManageConsent)
        })
        describe('Promote article in Organization "Create organization community of purpose"', () => {
          articleListScreen.searchArticle(articleCreateCop)
          articleListScreen.resetUnPromoteArticle(articleCreateCop)
          articleListScreen.promoteArticle(articleCreateCop)
        })
        describe('Verify both articles in list', () => {
          articleListScreen.verifyPromotedArticle(articleCreateCop, 0)
          articleListScreen.verifyPromotedArticle(articleManageConsent, 1)
        })
        describe('Crosswired User can see only article from platform', () => {
          cy.visitThenSignIn('/', crosswiredUser)
          recommendedHelpGuides.waitRecommended()
          recommendedHelpGuides.expectTotalArticle(1)
          recommendedHelpGuides.expectArticleCardWithData(
            articleManageConsent,
            articleManageConsentBody
          )
          recommendedHelpGuides.unExpectArticleCardWithData(articleCreateCop, articleCreateCopBody)
        })
        describe('Organization Member can see article from organization', () => {
          cy.visitThenSignIn('/', organizationMember)
          recommendedHelpGuides.waitRecommended()
          recommendedHelpGuides.expectTotalArticle(2)
          recommendedHelpGuides.expectArticleCardWithData(
            articleManageConsent,
            articleManageConsentBody
          )
          recommendedHelpGuides.expectArticleCardWithData(articleCreateCop, articleCreateCopBody)
        })
      })
    })
  })
})
