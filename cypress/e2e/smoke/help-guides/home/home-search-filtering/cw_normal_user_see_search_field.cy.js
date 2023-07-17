import Epic from '../../../../../classes/Epic'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import Story from '../../../../../classes/Story'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.HelpGuides, () => {
  const helpGuidesHome = new HelpGuidesHome()
  context(Story.homeBannerArticleList, () => {
    it('CW Normal User able to see search field', () => {
      Story.ticket('QA-241')

      SignInAs.cwUser('web/help-guide')
      helpGuidesHome.initNavigationWrapper()

      cy.get('@searchWrapper').find('button.search-icon').should('be.visible')
      cy.get('@searchInputField').should('have.attr', 'placeholder', 'Search by keyword')
      cy.get('@searchButton').should('be.visible')
    })
  })
})
