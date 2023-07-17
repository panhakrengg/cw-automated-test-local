import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import Table from '../../../../../classes/components/Table'
import Field from '../../../../../classes/constants/Field'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminNavigation from '../../../../../classes/help-guides/admin/Navigation'
import Topics from '../../../../../classes/help-guides/admin/Topics'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import HelpGuideFixture from '../../../../../classes/utilities/HelpGuideFixture'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  const adminArticleList = new ArticleListScreen()
  const adminArticleModify = new ModifyArticle()
  const adminHelpGuide = new AdminHelpGuide()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const adminNavigation = new AdminNavigation()
  const adminTopic = new Topics()
  const helpGuideFixture = new HelpGuideFixture()
  const helpGuideHome = new HelpGuidesHome()
  const tableTopic = new Table('@TableTopic')

  let totalArticle
  const getTotalArticleBeforeUpdate = () => {
    cy.getValueFromCellByRowName('User Settings', 1).then(($total) => {
      totalArticle = $total.text().trim()
    })
  }
  beforeEach(() => {
    helpGuideFixture.getManageTopicData()
    helpGuideHome.interceptFilter()

    adminHelpGuideLogin.signInAsAdminToTab()
    adminHelpGuide.initTable('TableTopic')
    adminNavigation.clickTopics()

    getTotalArticleBeforeUpdate()
  })

  context(Story.adminTopicsRoles, () => {
    it('Help Guide Admin create a new topic and get validate', () => {
      Story.ticket('QA-614')
      context('Create with existing name', () => {
        adminHelpGuide.resetUpdateData('topics')
        adminTopic.createWithExistingRole()
      })
      context('There is an error message "Duplicate name"', () => {
        cy.swal2().within(() => cy.showErrorDuplicateName())
      })
    })
    it('Help Guide admin create a new topic then check the topic shows in modify article', () => {
      Story.ticket('QA-299')
      cy.get('@manageTopicAdmin').then((manageTopicAdmin) => {
        const newTopicName = manageTopicAdmin.name.new

        cy.logInTestCase('create topic')
        adminHelpGuide.resetCreateData(newTopicName)
        adminTopic.create()

        cy.logInTestCase('Topic show in the list with 0 article')
        adminTopic.topicCheckTotalArticle('create', 0)

        cy.logInTestCase('Topic show in filter of home')
        cy.navBarCollapse('Help Guide').click()
        helpGuideHome.waitFilter()
        helpGuideHome.clickTopicsDropdown()
        helpGuideHome.initNavigationWrapper()
        helpGuideHome.hasValue('@topicsDropdown', newTopicName)

        cy.logInTestCase('Topic show in modify article screen by organization admin')
        adminHelpGuideLogin.signInAsOrgAdminToTab()
        adminArticleList.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
        adminArticleModify.newDataIsUnselect('topic', newTopicName)
      })
    })
    it('Help Guide admin edit topic by clicking on the name then check the topic in modify articlee', () => {
      Story.ticket('QA-300')
      cy.get('@manageTopic').then((manageTopic) => {
        const manageTopicAdmin = manageTopic.admin.topics
        const editTopicName = manageTopicAdmin.name.edit
        const topicName = manageTopicAdmin.name.value
        const articleName = manageTopic.home.articles.name.value

        cy.logInTestCase('Update topic "General"')
        adminHelpGuide.resetUpdateData('topics')
        adminTopic.clickTopicName(topicName)
        adminTopic.update()

        cy.logInTestCase('Updated in the list with old total articles')
        adminTopic.topicCheckTotalArticle('update', totalArticle)

        cy.logInTestCase('Updated in filter of home')
        cy.navBarCollapse('Help Guide').click()
        helpGuideHome.waitFilter()
        helpGuideHome.clickTopicsDropdown()
        helpGuideHome.initNavigationWrapper()
        helpGuideHome.hasValue('@topicsDropdown', editTopicName)

        cy.logInTestCase('Updated in article screen "Change email (has video file)"')
        helpGuideHome.searchArticleByEnter(articleName)
        helpGuideHome.tagUpdated(articleName, editTopicName)

        cy.logInTestCase('Updated modify article screen by organization admin')
        adminHelpGuideLogin.signInAsOrgAdminToTab()
        adminArticleList.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
        adminArticleModify.newDataIsUnselect('topic', editTopicName)
      })
    })
    it('Help Guide admin delete topic by clicking on the name then check the topic in modify article', () => {
      Story.ticket('QA-301')
      cy.get('@manageTopic').then((manageTopic) => {
        const manageTopicAdmin = manageTopic.admin.topics
        const articleName = manageTopic.admin.articles.name.value
        const deleteTopicName = manageTopicAdmin.name.delete

        cy.logInTestCase('Delete topic "Setting"')
        adminHelpGuide.resetDeleteData('topics')
        adminHelpGuide.deleteData(deleteTopicName)
        cy.get('tbody').should('not.contain.text', deleteTopicName)

        cy.logInTestCase('Deleted from filter of home')
        cy.navBarCollapse('Help Guide').click()
        helpGuideHome.waitFilter()
        helpGuideHome.clickTopicsDropdown()
        helpGuideHome.initNavigationWrapper()
        helpGuideHome.noValue('@topicsDropdown', deleteTopicName)

        cy.logInTestCase(
          'Deleted from "Create a course without category" in article list by organization admin'
        )
        adminHelpGuideLogin.signInAsOrgAdminToTab()
        adminArticleList.searchArticle(articleName)
        cy.cwTable()
          .rowName(articleName)
          .within(($row) => {
            cy.wrap($row).should('not.contain.text', deleteTopicName)
          })

        cy.logInTestCase('Deleted in article screen "Create a course without category"')
        cy.navBarCollapse('Help Guide').click()
        helpGuideHome.waitFilter()
        helpGuideHome.searchArticleByEnter(articleName)
        helpGuideHome.tagDeleted(articleName, deleteTopicName)
      })
    })
  })
  context(Story.adminTopicsRoles, () => {
    const subject = '@TableTopic'
    it('Help Guide admin sort topics', () => {
      Story.ticket('QA-302')

      cy.logInTestCase('Column "Name" sort by ascending')
      adminHelpGuide.clickColumnName(subject, Field.NAME)
      tableTopic.expectSortAscending(0)

      cy.logInTestCase('Column "Name" sort by descending')
      adminHelpGuide.clickColumnName(subject, Field.NAME)
      tableTopic.expectSortDescending(0)

      cy.logInTestCase('Column "Articles" sort by ascending')
      adminHelpGuide.clickColumnName(subject, 'Articles')
      tableTopic.expectSortAscending(1)

      cy.logInTestCase('Column "Articles" sort by descending')
      adminHelpGuide.clickColumnName(subject, 'Articles')
      tableTopic.expectSortDescending(1)
    })
  })
})
