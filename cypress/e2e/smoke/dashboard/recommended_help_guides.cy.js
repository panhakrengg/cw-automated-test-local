import RecommendedHelpGuides from '../../../classes/dashboard/RecommendedHelpGuides'
import Epic from '../../../classes/Epic'
import ArticleDetail from '../../../classes/help-guides/home/ArticleDetail'
import HelpGuidesHome from '../../../classes/help-guides/home/HelpGuidesHome'
import Story from '../../../classes/Story'
import UserRole from '../../../classes/utilities/user-role/UserRole'

describe(Epic.Dashboard, () => {
  const recommendedHelpGuides = new RecommendedHelpGuides()
  const articleDetail = new ArticleDetail()
  const helpGuidesPage = new HelpGuidesHome()
  const title = 'Create organization community of purpose'

  beforeEach(() => {
    recommendedHelpGuides.interceptRecommended()
  })

  context(Story.recommendationHelpGuide, () => {
    it('Crosswired user see one article', () => {
      Story.ticket('QA-844')
      cy.visitThenSignIn('/', 'CWUsers.allLogin')
      recommendedHelpGuides.waitRecommended()

      recommendedHelpGuides.title()
      recommendedHelpGuides.expectTotalArticle('1')
      recommendedHelpGuides.expectArticleCardWithoutData()
      recommendedHelpGuides.goToHelpGuides()
    })

    it('Organization member in one organization see 2 articles', () => {
      Story.ticket('QA-846')
      describe('Sign in and view "Recommended Help Guide" label', () => {
        cy.visitThenSignIn('/', UserRole.ORG_MEMBER.NORMAL)
        recommendedHelpGuides.waitRecommended()
        recommendedHelpGuides.title()
      })
      describe('Verify articles', () => {
        recommendedHelpGuides.expectArticleCardWithoutData()
        cy.get('@articleCard').then((articleCard) => {
          if (articleCard.length > 1) {
            recommendedHelpGuides.expectTotalArticle('2')
            recommendedHelpGuides.expectArticleCardWithData(
              title,
              'Steps Sign in to system as Community Creator Click My Communities in Global Menu Click Create Community of Purpose Select'
            )
          }
        })
      })
      describe('Has go to help guide', () => {
        recommendedHelpGuides.goToHelpGuides()
      })
    })

    it('Exited organization member in one organization see one article', () => {
      Story.ticket('QA-847')
      cy.visitThenSignIn('/', UserRole.ORG_MEMBER.EXITED)
      recommendedHelpGuides.waitRecommended()

      recommendedHelpGuides.title()
      recommendedHelpGuides.expectTotalArticle('1')
      recommendedHelpGuides.expectArticleCardWithoutData()
      recommendedHelpGuides.goToHelpGuides()
    })

    it('Crosswired user click Go to help guide link', () => {
      Story.ticket('QA-848')
      cy.visitThenSignIn('/', 'CWUsers.allLogin')
      recommendedHelpGuides.waitRecommended()

      helpGuidesPage.interceptFilter()
      recommendedHelpGuides.clickGoToHelpGuides()
      helpGuidesPage.viewWholePage()
    })

    it('Organization member click article title', () => {
      Story.ticket('QA-849')
      cy.visitThenSignIn('/', UserRole.ORG_MEMBER.NORMAL)
      recommendedHelpGuides.waitRecommended()
      articleDetail.interceptRelatedArticle()

      recommendedHelpGuides.clickArticle(title)
      articleDetail.viewStaticData()
    })
  })
})
