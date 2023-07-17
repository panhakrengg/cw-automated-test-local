import Epic from '../../../../../classes/Epic'
import HomePageSearch from '../../../../../classes/help-guides/home/HomePageSearch'
import Story from '../../../../../classes/Story'
import HelpGuideFixture from '../../../../../classes/utilities/HelpGuideFixture'

describe(Epic.HelpGuides, () => {
  const homePageSearch = new HomePageSearch()
  const helpGuideFixtures = new HelpGuideFixture()

  before(() => {
    helpGuideFixtures.getData()
    cy.get('@helpGuideHome').then((helpGuideHome) => {
      homePageSearch.interceptFilter()

      homePageSearch.signInBy(helpGuideHome.viewBy.organizationMember)
      homePageSearch.waitFilter()
    })
  })

  context(Story.homeBannerArticleList, () => {
    it('Org Member able to scroll to view more articles', () => {
      Story.ticket('QA-237')
      homePageSearch.interceptSearchArticle()
      homePageSearch.scrollToViewMoreArticles()
      homePageSearch.expectTotalRenderArticles(20)
    })
  })
})
