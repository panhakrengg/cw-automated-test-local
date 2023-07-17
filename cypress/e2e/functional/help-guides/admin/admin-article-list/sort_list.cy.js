import Pagination from '../../../../../classes/components/Pagination'
import Epic from '../../../../../classes/Epic'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import AdminHelpGuideIntercept from '../../../../../classes/help-guides/base-help-guides/operation/AdminHelpGuideIntercept'
import Story from '../../../../../classes/Story'

describe(Epic.HelpGuides, () => {
  const adminHelpGuide = new AdminHelpGuide()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const itcAdminHelpGuide = new AdminHelpGuideIntercept()
  beforeEach(() => {
    adminHelpGuideLogin.signInAsAdminTwoOrgToTab()
    adminHelpGuide.initTable('TableArticle')
    new Pagination().changePagination(2)
  })
  context(Story.adminArticleList, () => {
    const subject = '@tableArticle'
    it('Org Admin of 2 organizations sort article list', () => {
      Story.ticket('QA-274')
      describe('Column "Title" by ascending', () => {
        adminHelpGuide.clickColumnName(subject, 'Title')
        itcAdminHelpGuide.waitList()
        cy.getCellData('title', 'ListArticle').expectLocaleCompareSortAscending()
      })
      describe('Column "Title" by descending', () => {
        adminHelpGuide.clickColumnName(subject, 'Title')
        itcAdminHelpGuide.waitList()
        cy.getCellData('title', 'ListArticle').expectLocaleCompareSortDescending()
      })
      describe('Column "Managed by" ascending', () => {
        adminHelpGuide.clickColumnName(subject, 'Managed by')
        itcAdminHelpGuide.waitList()
        cy.getCellData('manageByOrganizationName', 'ListArticle').expectLocaleCompareSortAscending()
      })
      describe('Column "Managed by" by descending', () => {
        adminHelpGuide.clickColumnName(subject, 'Managed by')
        itcAdminHelpGuide.waitList()
        cy.getCellData(
          'manageByOrganizationName',
          'ListArticle'
        ).expectLocaleCompareSortDescending()
      })
    })
  })
})
