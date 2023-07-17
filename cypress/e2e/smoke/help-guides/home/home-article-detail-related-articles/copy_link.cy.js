import Epic from '../../../../../classes/Epic'
import ArticleDetail from '../../../../../classes/help-guides/home/ArticleDetail'
import Story from '../../../../../classes/Story'
import HelpGuideFixture from '../../../../../classes/utilities/HelpGuideFixture'

const helpGuideFixture = new HelpGuideFixture()
const articleDetail = new ArticleDetail()

describe(Epic.HelpGuides, () => {
  let orgMember = ``
  let crosswiredUser = ``
  let articlePlatform = ``
  let articleWebLearn = ``

  beforeEach(() => {
    helpGuideFixture.getCopyLinkArticleData()
    cy.get('@orgMember').then((user) => {
      orgMember = user
    })
    cy.get('@crosswiredUser').then((user) => {
      crosswiredUser = user
    })
    cy.get('@articleTitlePlatform').then((articleTitle) => {
      articlePlatform = articleTitle
    })
    cy.get('@articleTitleWebLearn').then((articleTitle) => {
      articleWebLearn = articleTitle
    })
  })

  context(Story.homeArticleDetailRelatedArticles, () => {
    it('Copy Link on Platform article and paste to Org Member', () => {
      Story.ticket('QA-257')
      articleDetail.visitFromPlatform(orgMember)
      articleDetail.showDetailTitle(articlePlatform)
    })
    it('Copy Link on Platform article and paste to Crosswired user', () => {
      Story.ticket('QA-258')
      articleDetail.visitFromPlatform(crosswiredUser)
      articleDetail.showDetailTitle(articlePlatform)
    })
    it('Copy Link on Org article and paste to Org Member', () => {
      Story.ticket('QA-259')
      articleDetail.visitFromWebLearn(orgMember)
      articleDetail.showDetailTitle(articleWebLearn)
    })
    it('Copy Link on Org article and paste to Crosswired user', () => {
      Story.ticket('QA-260')
      articleDetail.visitFromWebLearn(crosswiredUser)
      cy.pageNotFound()
    })
  })
})
