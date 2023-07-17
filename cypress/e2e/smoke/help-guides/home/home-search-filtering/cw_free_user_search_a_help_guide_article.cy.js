import Epic from '../../../../../classes/Epic'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import Story from '../../../../../classes/Story'
import Faker from '../../../../../classes/utilities/Faker'

describe(Epic.HelpGuides, () => {
  const helpGuidesHome = new HelpGuidesHome()
  const faker = new Faker()
  beforeEach(() => {
    helpGuidesHome.interceptFilter()
    helpGuidesHome.signInBy('CWUsers.freemium')
    helpGuidesHome.viewWholePage()
  })

  context(Story.homeSearchFilter, () => {
    it('Cw Free User search a help guide article', () => {
      Story.ticket('QA-246')
      const articleTitle = faker.getAuTextNotDelete('Managing Your Accepted Consent Forms')
      context('Search article by enter', () => {
        helpGuidesHome.searchArticleByEnter(articleTitle)
        helpGuidesHome.displaySearchResultFor(articleTitle, 1)
      })

      context('Search article by search button', () => {
        helpGuidesHome.searchArticleBySearchButton(articleTitle)
        helpGuidesHome.displaySearchResultFor(articleTitle, 1)
      })
    })
  })
})
