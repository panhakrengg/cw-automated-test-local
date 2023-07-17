import Epic from '../../../../../classes/Epic'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import Story from '../../../../../classes/Story'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.HelpGuides, () => {
  const helpGuidesHome = new HelpGuidesHome()
  const articleCreateOrgCoP = `Create organization community of purpose`
  const articleInviteUserOrg = `Invite user to organization (has youtube)`
  const articleCourseCategory = `Create a course with category`
  const HAVE_RESULT = 1

  beforeEach(() => {
    helpGuidesHome.interceptSearchArticle()
    helpGuidesHome.interceptFilter()
    helpGuidesHome.signInBy(UserRole.ORG_MEMBER.NORMAL)
    helpGuidesHome.viewWholePage()
  })
  context(Story.homeBannerArticleList, () => {
    it('Org Member able to see article with feature image', () => {
      Story.ticket('QA-222')
      helpGuidesHome.searchArticleByEnter(articleCreateOrgCoP)
      helpGuidesHome.showCardArticle(articleCreateOrgCoP)
      helpGuidesHome.checkArticleFeatureImgRender(articleCreateOrgCoP)
    })
    it('Org Member able to see article as video type', () => {
      Story.ticket('QA-223')
      helpGuidesHome.searchArticleByEnter(articleInviteUserOrg)
      helpGuidesHome.displaySearchResultFor(articleInviteUserOrg, HAVE_RESULT)
      helpGuidesHome.showCardArticle(articleInviteUserOrg)
      helpGuidesHome.checkArticleVideoTypeRender(articleInviteUserOrg)
    })

    it('Org Member able to see article without feature image', () => {
      Story.ticket('QA-224')
      helpGuidesHome.searchArticleByEnter(articleCourseCategory)
      helpGuidesHome.showCardArticle(articleCourseCategory)
      helpGuidesHome.checkArticleWithoutImgRender(articleCourseCategory)
    })
  })
})
