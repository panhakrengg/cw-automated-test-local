import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import Table from '../../../../../classes/components/Table'
import Field from '../../../../../classes/constants/Field'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminNavigation from '../../../../../classes/help-guides/admin/Navigation'
import Roles from '../../../../../classes/help-guides/admin/Roles'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import HelpGuideFixture from '../../../../../classes/utilities/HelpGuideFixture'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  const adminArticleList = new ArticleListScreen()
  const adminArticleModify = new ModifyArticle()
  const adminHelpGuide = new AdminHelpGuide()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const adminNavigation = new AdminNavigation()
  const adminRole = new Roles()
  const helpGuideFixture = new HelpGuideFixture()
  const helpGuideHome = new HelpGuidesHome()
  const tableRole = new Table('@TableRole')
  let totalArticle
  const getTotalArticleBeforeUpdate = () => {
    cy.getValueFromCellByRowName('General', 1).then(($total) => {
      totalArticle = $total.text().trim()
    })
  }
  beforeEach(() => {
    helpGuideFixture.getManageRoleData()
    helpGuideHome.interceptFilter()

    adminHelpGuideLogin.signInAsAdminToTab()
    adminHelpGuide.initTable('TableRole')
    adminNavigation.clickRoles()

    getTotalArticleBeforeUpdate()
  })

  context(Story.adminTopicsRoles, () => {
    it('Help Guide Admin create a new role and get validate', () => {
      Story.ticket('QA-328')
      context('Create with existing name', () => {
        adminHelpGuide.resetUpdateData('roles')
        adminRole.createWithExistingRole()
      })
      context('There is an error message "Duplicate name"', () => {
        cy.swal2().within(() => cy.showErrorDuplicateName())
      })
    })
    it('Help Guide admin create a new role then check the role shows in modify article', () => {
      Story.ticket('QA-600')
      cy.get('@manageRoleAdmin').then((manageRoleAdmin) => {
        const newRoleName = manageRoleAdmin.name.new

        cy.logInTestCase('create role')
        adminHelpGuide.resetCreateData(newRoleName)
        adminRole.create()

        cy.logInTestCase('Role show in the list with 0 article')
        adminRole.roleCheckTotalArticle('create', 0)

        cy.logInTestCase('Role show in filter of home')
        cy.navBarCollapse('Help Guide').click()
        helpGuideHome.waitFilter()
        helpGuideHome.clickRolesDropdown()
        helpGuideHome.initNavigationWrapper()
        helpGuideHome.hasValue('@rolesDropdown', newRoleName)

        cy.logInTestCase('Role show in modify article screen by organization admin')
        adminHelpGuideLogin.signInAsOrgAdminToTab()
        adminArticleList.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
        adminArticleModify.newDataIsUnselect('role', newRoleName)
      })
    })
    it('Help Guide admin edit role by clicking on the name then check the topic in modify article', () => {
      Story.ticket('QA-683')
      cy.get('@manageRole').then((manageRole) => {
        const manageRoleAdmin = manageRole.admin.roles
        const editRoleName = manageRoleAdmin.name.edit
        const roleName = manageRoleAdmin.name.value
        const articleName = manageRole.home.articles.name.value

        cy.logInTestCase('Update role "General"')
        adminHelpGuide.resetUpdateData('roles')
        adminRole.clickRoleName(roleName)
        adminRole.update()

        cy.logInTestCase('Updated in the list with old total articles')
        adminRole.roleCheckTotalArticle('update', totalArticle)

        cy.logInTestCase('Updated in filter of home')
        cy.navBarCollapse('Help Guide').click()
        helpGuideHome.waitFilter()
        helpGuideHome.clickRolesDropdown()
        helpGuideHome.initNavigationWrapper()
        helpGuideHome.hasValue('@rolesDropdown', editRoleName)

        cy.logInTestCase('Updated in article screen "Change email (has video file)"')
        helpGuideHome.searchArticleByEnter(articleName)
        helpGuideHome.tagUpdated(articleName, editRoleName)

        cy.logInTestCase('Updated modify article screen by organization admin')
        adminHelpGuideLogin.signInAsOrgAdminToTab()
        adminArticleList.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
        adminArticleModify.newDataIsUnselect('role', editRoleName)
      })
    })
    it('Help Guide admin delete role by clicking on the name then check the role in modify article', () => {
      Story.ticket('QA-601')
      cy.get('@manageRole').then((manageRole) => {
        const manageRoleAdmin = manageRole.admin.roles
        const articleName = manageRole.admin.articles.name.value
        const deleteRoleName = manageRoleAdmin.name.delete

        cy.logInTestCase('Delete role "Setting"')
        adminHelpGuide.resetDeleteData('roles')
        adminHelpGuide.deleteData(deleteRoleName)
        cy.get('tbody').should('not.contain.text', deleteRoleName)

        cy.logInTestCase('Deleted from filter of home')
        cy.navBarCollapse('Help Guide').click()
        helpGuideHome.waitFilter()
        helpGuideHome.clickRolesDropdown()
        helpGuideHome.initNavigationWrapper()
        helpGuideHome.noValue('@rolesDropdown', deleteRoleName)

        cy.logInTestCase(
          'Deleted from "Create a course without category" in article list by organization admin'
        )
        adminHelpGuideLogin.signInAsOrgAdminToTab()
        adminArticleList.searchArticle(articleName)
        cy.cwTable()
          .rowName(articleName)
          .within(($row) => {
            cy.wrap($row).should('not.contain.text', deleteRoleName)
          })

        cy.logInTestCase('Deleted in article screen "Create a course without category"')
        cy.navBarCollapse('Help Guide').click()
        helpGuideHome.waitFilter()
        helpGuideHome.searchArticleByEnter(articleName)
        helpGuideHome.tagDeleted(articleName, deleteRoleName)
      })
    })
  })
  context(Story.adminTopicsRoles, () => {
    const subject = '@TableRole'
    it('Help Guide admin sort roles', () => {
      Story.ticket('QA-686')

      cy.logInTestCase('Column "Name" sort by ascending')
      adminHelpGuide.clickColumnName(subject, Field.NAME)
      tableRole.expectSortAscending(0)

      cy.logInTestCase('Column "Name" sort by descending')
      adminHelpGuide.clickColumnName(subject, Field.NAME)
      tableRole.expectSortDescending(0)

      cy.logInTestCase('Column "Articles" sort by ascending')
      adminHelpGuide.clickColumnName(subject, 'Articles')
      tableRole.expectSortAscending(1)

      cy.logInTestCase('Column "Articles" sort by descending')
      adminHelpGuide.clickColumnName(subject, 'Articles')
      tableRole.expectSortDescending(1)
    })
  })
})
