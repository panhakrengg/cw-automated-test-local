import Environment from '../../../../../base/Environment'
import EntryYamlManagement from '../../../../../utilities/EntryYamlManagement'

class MemberManagement {

  static getEnvYaml() {
    return new Environment().getEnvYaml()
  }

  static getUser(dataEntryCallback = () => {}) {
    const pathUnderFixture = 'cop-file-sharing/manage-file'
    const baseYamlPath = 'ManageMembersSuite'
    EntryYamlManagement._readDataEntry(pathUnderFixture, baseYamlPath, (ManageMembersSuite) => {
      dataEntryCallback(ManageMembersSuite.manageMembers)
    })
  }

  static signInEmailMemberByIndex(index) {
    this.getUser((manageMembers) => {
      const email = manageMembers.members[this.getEnvYaml()][index]
      cy.signInViaEmail(email)
    })
  }

  static _loginAsCoPMemberPayton() {
    this.signInEmailMemberByIndex(0)
  }

  static _loginAsCoPMemberElder50() {
    this.signInEmailMemberByIndex(1)
  }

  static _loginAsOrgMemberJason() {
    this.signInEmailMemberByIndex(2)
  }

  static _loginAsOrgMemberElucy() {
    this.signInEmailMemberByIndex(3)
  }

  static _loginAsOrgMemberLitzy5() {
    this.getUser((manageMembers) => {
      const email = manageMembers.noMembers[this.getEnvYaml()][0]
      cy.signInViaEmail(email)
    })
  }

  static _loginAsAdmin() {
    this.getUser((manageMembers) => {
      const email = manageMembers.admins[this.getEnvYaml()][0]
      cy.signInViaEmail(email)
    })
  }

  static _loginAsOwner() {
    this.getUser((manageMembers) => {
      const email = manageMembers.owner[this.getEnvYaml()][0]
      cy.signInViaEmail(email)
    })
  }
}
export default MemberManagement
