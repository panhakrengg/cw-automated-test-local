import Field from '../../constants/Field'
import HelpGuideFixture from '../../utilities/HelpGuideFixture'
import Navigation from './Navigation'
import Roles from './Roles'
import TopicRole from './TopicRole'
import Topics from './Topics'

class AdminHelpGuide {
  sidebar = new Navigation()

  constructor() {
    this.adminTopic = new Topics()
    this.adminRole = new Roles()
    this.itcAdminHelpGuide = this.sidebar.itcAdminHelpGuide
  }

  initTable(name) {
    cy.cwTable(name)
  }

  onTab(tabName = articles) {
    this.itcAdminHelpGuide.interceptFetchCategories()
    this.sidebar.interceptSidebarItems()
    this.sidebar
      .waitSidebarItems()
      .then(() => {
        cy.cecCard().cecCardBody().find('nav a').filter(`a:contains(${tabName})`).click()
      })
      .waitFetchCategories()
      .then(() => {
        this.initColumnName()
      })
  }

  initColumnName() {
    cy.get('td').eq(0).as('name')
    cy.get('td').eq(1).as('articles')
  }

  initToolbarHeader() {
    cy.cecCard()
      .get('.cec-card-two-columns-small-left-side')
      .cardRightContent()
      .get('.cec-card__header_fix_height')
      .eq(1)
      .as('toolbarHeader')
    cy.get('.btn-primary').as('btnNew')
  }

  getData() {
    const helpGuideFixture = new HelpGuideFixture()
    helpGuideFixture.getData()
    helpGuideFixture.getManageTopicData()
    helpGuideFixture.getManageRoleData()
  }

  clickButtonInToolbarHeader(label) {
    this.initToolbarHeader()
    cy.get('@toolbarHeader').within(($header) => {
      cy.wrap($header).contains(label).click({ force: true })
    })
  }

  clickDeleteButton() {
    this.clickButtonInToolbarHeader(Field.DELETE)
  }

  getDataAliases(navName) {
    let fromAliases

    if (navName == 'articles') {
      // admin article aliases
    } else if (navName == 'topics') {
      fromAliases = '@manageTopicAdmin'
    } else {
      fromAliases = '@manageRoleAdmin'
    }
    return fromAliases
  }
  deleteData(name) {
    this.itcAdminHelpGuide.itcPostDeleteSet()
    cy.get('tbody')
      .invoke('text')
      .then((text) => {
        if (text.includes(name)) {
          cy.rowCheckbox(name).click()
          this.clickDeleteButton()
          cy.swal2Confirm(Field.YES_DELETE).click()
          this.itcAdminHelpGuide.itcPostDeleteWait()
        }
      })
  }
  resetCreateData(value) {
    this.deleteData(value)
  }
  resetUpdateData(navName) {
    this.getData()
    var fromAliases = this.getDataAliases(navName)

    cy.get(fromAliases).then((helpGuideAdmin) => {
      const name = helpGuideAdmin.name.value
      const editName = helpGuideAdmin.name.edit

      cy.get('tbody')
        .invoke('text')
        .then((text) => {
          if (text.includes(editName)) {
            if (navName == 'articles') {
              // rename article title
            } else if (navName == 'topics') {
              this.adminTopic.clickTopicName(name)
              this.adminTopic.update(true)
            } else {
              this.adminRole.clickRoleName(name)
              this.adminRole.update(true)
            }
          }
        })
    })
  }
  resetDeleteData(navName) {
    this.getData()

    const topicRole = new TopicRole()
    var fromAliases = this.getDataAliases(navName)

    cy.get(fromAliases).then((adminData) => {
      const value = adminData.name.delete

      cy.get('tbody')
        .invoke('text')
        .then((text) => {
          if (!text.includes(value)) {
            if (navName == 'article') {
              // article
            } else if (navName == 'topics') {
              this.adminTopic.clickNewTopic()
              topicRole.inputThenCreate(value)
            } else {
              this.adminRole.clickNewRole()
              topicRole.inputThenCreate(value)
            }
          }
        })
    })
  }
  clickColumnName(subject, name) {
    cy.get(subject).clickTableHeader(name)
  }
  selectCheckboxes(totalSelected) {
    for (let index = 0; index < totalSelected; index++) {
      cy.selectRowCheckboxByIndex(index)
    }
  }
  showDialogDelete(navName, totalDeleted) {
    const popupLabel =
      totalDeleted == 1 ? `Delete this ${navName}?` : `Delete these ${totalDeleted} ${navName}s?`
    cy.verifySwal2Confirmation(
      popupLabel,
      Field.NOTE_THIS_ACTION_CANNOT_BE_UNDONE,
      Field.YES_DELETE,
      Field.CANCEL
    )
    cy.closeSwal2()
  }
  clearSearchBox() {
    this.itcAdminHelpGuide.interceptList()
    this.initToolbarHeader()
    cy.get('@toolbarHeader').inputSearch().clear().type(`{enter}`)
    this.itcAdminHelpGuide.waitList()
  }
}

export default AdminHelpGuide
