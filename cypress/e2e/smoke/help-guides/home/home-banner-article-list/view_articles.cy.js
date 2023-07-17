import Epic from '../../../../../classes/Epic'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import Story from '../../../../../classes/Story'

describe(Epic.HelpGuides, () => {
  const helpGuidesHome = new HelpGuidesHome()
  beforeEach(() => {
    helpGuidesHome.interceptFilter()
    helpGuidesHome.signInBy('CWUsers.freemium')
    helpGuidesHome.viewWholePage()
  })
  context(Story.homeBannerArticleList, () => {
    it('CW Free User able to see Big article at the top (if has)', () => {
      Story.ticket('QA-220')
      helpGuidesHome.checkBigCardArticle()
    })
    it('CW Free User able to see standard display for articles', () => {
      Story.ticket('QA-225')
      helpGuidesHome.checkStandardArticle()
    })
  })
})
