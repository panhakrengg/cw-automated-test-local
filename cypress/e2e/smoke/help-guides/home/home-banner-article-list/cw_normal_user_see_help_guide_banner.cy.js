import Epic from '../../../../../classes/Epic'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import Story from '../../../../../classes/Story'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.HelpGuides, () => {
  context(Story.homeBannerArticleList, () => {
    it('CW Normal User able to see Banner block', () => {
      Story.ticket('QA-236')
      SignInAs.cwUser('web/help-guide')
      new HelpGuidesHome().bannerWithoutData()
    })
  })
})
