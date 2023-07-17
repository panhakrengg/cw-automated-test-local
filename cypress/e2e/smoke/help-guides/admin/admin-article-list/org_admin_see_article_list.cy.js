import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import Field from '../../../../../classes/constants/Field'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import { OrgConst } from '../../../../../classes/org-management/base-org-management/OrgStub'
import Faker from '../../../../../classes/utilities/Faker'

describe(Epic.HelpGuides, () => {
  const adminHelpGuide = new AdminHelpGuide()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const articleListScreen = new ArticleListScreen()
  const faker = new Faker()

  const expectArticleRow = (rowIndex = 0, isPromoted) => {
    cy.get('@tableArticle')
      .getTableRow(rowIndex)
      .within(() => {
        cy.isUnchecked()
        cy.get('a.text-truncate span').should('be.visible')
        isPromoted ? cy.get('a.text-truncate .tag-categories-list').should('be.visible') : ''
        isPromoted
          ? cy.expectElementWithLabelVisible('Promoted', '.rounded-circle')
          : cy.expectElementWithLabelNotExist('Promoted')
        cy.expectElementWithLabelVisible(OrgConst.NAME, 'span')
        cy.getThreeDots().should('be.visible')
      })
  }

  beforeEach(() => {
    adminHelpGuideLogin.signInAsOrgAdminToTab('articles')
    adminHelpGuide.initToolbarHeader()
  })
  context(Story.adminArticleList, () => {
    it('Org Admin able to see Article list Screen', () => {
      Story.ticket('QA-273')
      describe('Verify header', () => {
        cy.get('@toolbarHeader').within(($header) => {
          cy.wrap($header).find('span').should('contain.text', 'Articles')
          cy.wrap($header).find('a > span').should('contain.text', Field.DELETE)
          cy.wrap($header)
            .find('div.align-items-center > input')
            .should('have.attr', 'placeholder', 'Search')
        })
        cy.get('@btnNew').should('be.visible')
      })
      describe('Verify column name', () => {
        articleListScreen.initTable()
      })
      describe('Verify article row', () => {
        cy.get('@tableArticle').get('tr').should('have.length.lessThan', 11)
        expectArticleRow(0, true)
        expectArticleRow(1, false)
      })
      describe('Verify pagination', () => {
        cy.selectItemPerPage(75)
      })
      describe('has article "Invite user to community of purpose (has vimeo)"', () => {
        const article = 'Invite user to community of purpose (has vimeo)'
        articleListScreen.checkArticleByName(article)
        articleListScreen.hasTag('Video')
        articleListScreen.hasTag(faker.getAuTextNotDelete('Community Admins'))
        articleListScreen.hasTag(faker.getAuTextNotDelete('Communities of Purpose'))
        articleListScreen.hasTag(faker.getAuTextNotDelete('Security'))
      })
      describe('has article "Invite user to organization (has youtube)"', () => {
        const article = 'Invite user to organization (has youtube)'
        articleListScreen.checkArticleByName(article)
        articleListScreen.hasTag('Video')
        articleListScreen.hasTag(faker.getAuTextNotDelete('Security'))
      })
      describe('has article "Create a course with category"', () => {
        const article = 'Create a course with category'
        articleListScreen.checkArticleByName(article)
        articleListScreen.hasTag(faker.getAuTextNotDelete('Learning Admins'))
        articleListScreen.hasTag(faker.getAuTextNotDelete('Learning Management'))
      })
      describe('has article "Create organization community of purpose"', () => {
        const article = 'Create organization community of purpose'
        articleListScreen.checkArticleByName(article)
        articleListScreen.hasLabelPromoted()
        articleListScreen.hasTag(faker.getAuTextNotDelete('Learning Admins'))
        articleListScreen.hasTag(faker.getAuTextNotDelete('Communities of Purpose'))
      })
      describe('has article "Create a course without category"', () => {
        const article = 'Create a course without category'
        articleListScreen.checkArticleByName(article)
        articleListScreen.hasTag(faker.getAuTextNotDelete('Learning Admins'))
        articleListScreen.hasTag(faker.getAuTextNotDelete('Learning Management'))
      })
    })
  })
})
