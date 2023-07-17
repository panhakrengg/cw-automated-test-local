import Epic from '../../../../../classes/Epic'
import ArticleDetail from '../../../../../classes/help-guides/home/ArticleDetail'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import Story from '../../../../../classes/Story'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.HelpGuides, () => {
  const helpGuidesHome = new HelpGuidesHome()
  const articleDetail = new ArticleDetail()
  const platformManageConsent = 'Managing Your Accepted Consent Forms'
  const organizationCourseCategory = 'Create a course with category'

  const HAVE_RESULT = 1
  const NO_RESULT = 0

  beforeEach(() => {
    helpGuidesHome.interceptFilter()
    helpGuidesHome.interceptSearchArticle()
    articleDetail.interceptRelatedArticle()
  })
  context(Story.homeBannerArticleList, () => {
    it('CW Free User able to see articles only from Plaform', () => {
      Story.ticket('QA-233')
      helpGuidesHome.signInBy('CWUsers.freemium')
      helpGuidesHome.viewWholePage()
      helpGuidesHome.searchArticleByEnter(platformManageConsent)
      helpGuidesHome.displaySearchResultFor(platformManageConsent, HAVE_RESULT)
      helpGuidesHome.showCardArticle(platformManageConsent)
      helpGuidesHome.searchArticleByEnter(organizationCourseCategory)
      helpGuidesHome.displaySearchResultFor(organizationCourseCategory, NO_RESULT)
      helpGuidesHome.emptyResult()
    })
    it('Org Member able to see articles from Platform and Organization', () => {
      Story.ticket('QA-234')
      helpGuidesHome.signInBy(UserRole.ORG_MEMBER.NORMAL)
      helpGuidesHome.viewWholePage()
      helpGuidesHome.searchArticleByEnter(platformManageConsent)
      helpGuidesHome.displaySearchResultFor(platformManageConsent, HAVE_RESULT)
      helpGuidesHome.showCardArticle(platformManageConsent)
      helpGuidesHome.searchArticleByEnter(organizationCourseCategory)
      helpGuidesHome.displaySearchResultFor(organizationCourseCategory, HAVE_RESULT)
      helpGuidesHome.showCardArticle(organizationCourseCategory)
    })
    it('Exited Org Member not able to see article from Organization', () => {
      Story.ticket('QA-235')
      helpGuidesHome.signInBy(UserRole.ORG_MEMBER.EXITED)
      helpGuidesHome.viewWholePage()
      helpGuidesHome.searchArticleByEnter(platformManageConsent)
      helpGuidesHome.displaySearchResultFor(platformManageConsent, HAVE_RESULT)
      helpGuidesHome.showCardArticle(platformManageConsent)
      helpGuidesHome.searchArticleByEnter(organizationCourseCategory)
      helpGuidesHome.displaySearchResultFor(organizationCourseCategory, NO_RESULT)
      helpGuidesHome.emptyResult()
    })
  })
})
