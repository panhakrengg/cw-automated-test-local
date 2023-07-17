import AdminHelpGuide from './AdminHelpGuide'
import TopicRole from './TopicRole'

class Topics extends TopicRole {
  clickNewTopic() {
    const adminHelpGuide = new AdminHelpGuide()
    adminHelpGuide.clickButtonInToolbarHeader('New Topic')
  }
  create() {
    cy.get('@manageTopicAdmin').then((manageTopicAdmin) => {
      const topicTitle = manageTopicAdmin.name.new

      this.clickNewTopic()
      this.inputThenCreate(topicTitle)
    })
  }
  createWithExistingRole() {
    cy.get('@manageTopicAdmin').then((manageTopicAdmin) => {
      this.clickNewTopic()
      this.inputName(manageTopicAdmin.name.value)
      this.clickCreate()
    })
  }
  topicCheckTotalArticle(modifyType, total) {
    cy.get('@manageTopicAdmin').then((manageTopicAdmin) => {
      const topicData = manageTopicAdmin

      if (modifyType == 'create') {
        var topic = topicData.name.new
      } else if (modifyType == 'update') {
        var topic = topicData.name.edit
      }

      cy.cwTable()
        .rowName(topic)
        .within(() => {
          this.topicRoleCheckTotalArticle(topic, total)
        })
    })
  }
  update(backToStatic = false) {
    cy.get('@manageTopicAdmin').then((manageTopicAdmin) => {
      const topicData = manageTopicAdmin.name

      if (backToStatic == true) {
        var editData = topicData.value
      } else {
        var editData = topicData.edit
      }

      this.inputNameThenSave(editData)
    })
  }
  clickTopicName(name) {
    this.clickTopicRoleName(name)
  }
}
export default Topics
