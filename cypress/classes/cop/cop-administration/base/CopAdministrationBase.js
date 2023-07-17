import CopAdministrationLogin from './mock/CopAdministrationLogin'
import CopManageMembersYaml from './mock/CopManageMembersYaml'

export default class CopAdministrationBase {
  constructor() {
    this.login = new CopAdministrationLogin()
    this.copManageMembersYaml = new CopManageMembersYaml()
  }
}
