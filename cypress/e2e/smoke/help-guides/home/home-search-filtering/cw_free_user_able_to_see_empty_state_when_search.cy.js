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
    it('Cw Free User able to see empty state when search', () => {
      Story.ticket('QA-249')
      helpGuidesHome.searchArticleByEnter('"Search no result article"')
      helpGuidesHome.emptyResult()
    })
  })
})
