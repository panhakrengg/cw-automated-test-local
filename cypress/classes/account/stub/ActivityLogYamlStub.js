import EntryYamlManagement from '../../utilities/EntryYamlManagement'

class ActivityLogYamlStub {
  #readYamlData(fixturePath, extractKey, callback) {
    EntryYamlManagement._readDataEntry(fixturePath, extractKey, callback)
  }

  _getAuAcOrgAdminFullName(callback) {
    this.#readYamlData('users-orgmgt', 'Users.uat.auAcOrgAdmin', callback)
  }

  _getOrgWebLearn(callback) {
    this.#readYamlData('account', 'LearningAdmin.orgLms.webLearn', callback)
  }
}

export default ActivityLogYamlStub
