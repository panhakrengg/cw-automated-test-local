import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import Field from '../../../../../classes/constants/Field'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Faker from '../../../../../classes/utilities/Faker'

describe(Epic.HelpGuides, () => {
  const adminHelpGuide = new AdminHelpGuide()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const articleListScreen = new ArticleListScreen()
  const modifyArticle = new ModifyArticle()
  const faker = new Faker()
  const inviteUserToCoP = 'Invite user to community of purpose (has vimeo)'
  beforeEach(() => {
    adminHelpGuideLogin.signInAsOrgAdminToTab('articles')
    adminHelpGuide.initToolbarHeader()
    cy.selectItemPerPage(75)
  })
  context(Story.adminArticleList, () => {
    it('Org Admin able to see 3 dots of article', () => {
      Story.ticket('QA-1967')

      cy.logInTestCase('Verify "Promotion on dashboard"')
      articleListScreen.onAction('Promote on Dashboard', inviteUserToCoP)
      articleListScreen.showDialogPromote()

      cy.logInTestCase('Verify "Unpromote on dashboard"')
      articleListScreen.onAction(
        'Unpromote from Dashboard',
        'Create organization community of purpose'
      )
      articleListScreen.showDialogUnPromote()

      cy.logInTestCase('Verify "Delete" popup')
      articleListScreen.onAction(Field.DELETE, inviteUserToCoP)
      articleListScreen.showDialogDelete()

      cy.logInTestCase('Verify "Edit" open modify screen')
      modifyArticle._itcEditor.set()
      articleListScreen.onAction(Field.EDIT, inviteUserToCoP)
      modifyArticle._itcEditor.wait()
      modifyArticle.initAlias()
      modifyArticle.hasTitle(inviteUserToCoP)
      modifyArticle.includeVideoOn()
      modifyArticle.verifyUploadVideoWithLink()
      modifyArticle.isSelected('@topicBody', faker.getAuTextNotDelete('Communities of Purpose'))
      modifyArticle.isSelected('@topicBody', faker.getAuTextNotDelete('Security'))
      modifyArticle.isSelected('@roleBody', faker.getAuTextNotDelete('Community Admins'))
      modifyArticle.hasFeatureImage('@featuredImageBody', true)
    })
  })
})
