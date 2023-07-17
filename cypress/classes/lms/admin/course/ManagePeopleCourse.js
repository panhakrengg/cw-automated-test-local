import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'

class ManagePeopleCourse {
  #itcSearchUsers = new InterceptReq('/manage_people/users/search', 'SearchUsers')
  #itcAddMember = new InterceptReq('/manage_member/add', 'AddMember')
  _itcGetMembers = new InterceptReq('/course/get_members', 'GetMembers')
  _itcUpdateUserRole = new InterceptReq('/course/update/user_role', 'UpdateUserRole')

  addUsersInPopup(users) {
    this.#itcAddMember.set()
    this.#itcSearchUsers.set()
    cy.getPopup().within(() => {
      users.forEach((user) => {
        cy.inputByPlaceholder('Search users by name', user)
        this.#itcSearchUsers.wait()
        cy.getCheckbox().first().check()
      })
      cy.clickButtonByName(Field.ADD)
    })
    this.#itcAddMember.wait()
    this._itcGetMembers.wait()
  }
}
export default ManagePeopleCourse
