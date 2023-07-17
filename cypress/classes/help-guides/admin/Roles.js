import AdminHelpGuide from './AdminHelpGuide'
import TopicRole from './TopicRole'

class Roles extends TopicRole {
  clickNewRole() {
    const adminHelpGuide = new AdminHelpGuide()
    adminHelpGuide.clickButtonInToolbarHeader('New Role')
  }
  create() {
    cy.get('@manageRoleAdmin').then((manageRoleAdmin) => {
      const roleTitle = manageRoleAdmin.name.new

      this.clickNewRole()
      this.inputThenCreate(roleTitle)
    })
  }
  createWithExistingRole() {
    cy.get('@manageRoleAdmin').then((manageRoleAdmin) => {
      this.clickNewRole()
      this.inputName(manageRoleAdmin.name.value)
      this.clickCreate()
    })
  }
  roleCheckTotalArticle(modifyType, total) {
    cy.get('@manageRoleAdmin').then((manageRoleAdmin) => {
      const roleData = manageRoleAdmin

      if (modifyType == 'create') {
        var role = roleData.name.new
      } else if (modifyType == 'update') {
        var role = roleData.name.edit
      }

      cy.cwTable()
        .rowName(role)
        .within(() => {
          this.topicRoleCheckTotalArticle(role, total)
        })
    })
  }
  update(backToStatic = false) {
    cy.get('@manageRoleAdmin').then((manageRoleAdmin) => {
      const roleData = manageRoleAdmin.name

      if (backToStatic == true) {
        var editData = roleData.value
      } else {
        var editData = roleData.edit
      }

      this.inputNameThenSave(editData)
    })
  }
  clickRoleName(name) {
    this.clickTopicRoleName(name)
  }
}
export default Roles
