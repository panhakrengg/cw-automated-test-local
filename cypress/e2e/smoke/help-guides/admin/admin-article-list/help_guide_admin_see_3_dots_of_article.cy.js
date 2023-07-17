import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import Field from '../../../../../classes/constants/Field'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import AdminHelpGuideIntercept from '../../../../../classes/help-guides/base-help-guides/operation/AdminHelpGuideIntercept'
import HelpGuidesYamlStub from '../../../../../classes/help-guides/stub/HelpGuidesYamlStub'

describe(Epic.HelpGuides, { tags: '@skipPrd' }, () => {
  const adminHelpGuide = new AdminHelpGuide()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const articleListScreen = new ArticleListScreen()
  const modifyArticle = new ModifyArticle()
  const helpGuidesStub = new HelpGuidesYamlStub()
  let perfectLessonArticleTitle
  beforeEach(() => {
    adminHelpGuideLogin.signInAsAdminToTab('articles')
    adminHelpGuide.initToolbarHeader()
    helpGuidesStub.getExistingArticlesInPlatForm((articles) => {
      perfectLessonArticleTitle = articles.perfectLesson.value
    })
  })
  context(Story.adminArticleList, () => {
    it('Help Guide Admin able to see 3 dots of article', () => {
      Story.ticket('QA-276')
      context('Verify "Delete" popup', () => {
        articleListScreen.onAction(Field.DELETE, perfectLessonArticleTitle)
        articleListScreen.showDialogDelete()
      })

      context('Verify "Promote on Dashboard" popup', () => {
        articleListScreen.checkThreeDotsByRow(0)
        cy.cwRowName(perfectLessonArticleTitle)
          .getThreeDots()
          .clickDropdownName('Promote on Dashboard')
        articleListScreen.showDialogPromote()
      })

      context('Verify "Edit" open modify screen', () => {
        articleListScreen.checkThreeDotsByRow(0)
        cy.cwRowName(perfectLessonArticleTitle).getThreeDots().clickDropdownName(Field.EDIT)
        modifyArticle.initAlias()
        modifyArticle.hasTitle(perfectLessonArticleTitle)
        modifyArticle.includeVideoOn()
        modifyArticle.hasVideoFile()
        modifyArticle.verifyMangeByAndVisibility()
        modifyArticle.isSelected('@topicBody', helpGuidesStub.topics.userSettings)
        modifyArticle.isSelected('@topicBody', helpGuidesStub.topics.security)
        modifyArticle.isSelected('@topicBody', helpGuidesStub.topics.automate)
        modifyArticle.isSelected('@roleBody', helpGuidesStub.roles.general)
        modifyArticle.isSelected('@roleBody', helpGuidesStub.roles.trainers)
        modifyArticle.hasFeatureImage('@featuredImageBody', true)
      })
    })
  })
})
