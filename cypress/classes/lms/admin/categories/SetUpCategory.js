import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import ManageCategories from './ManageCategories'

class SetUpCategory extends ManageCategories {
  #ctgObject
  #ctgName
  #addUsers
  #addUserGroups

  setCategoryObject(obj) {
    const { name } = obj
    this.#ctgObject = obj
    this.#ctgName = name.value ? name.value : name
    this.#addUsers = this.#ctgObject.users.addUsers
    this.#addUserGroups = this.#ctgObject.userGroups
  }

  setCategoryName(name) {
    this.#ctgName = name
  }

  createNewCategory() {
    cy.logInTestCase(`Create category "${this.#ctgName}"`)
    this.visitManageCategories()
    cy.cwTable()
      .invoke('text')
      .then((text) => {
        if (!text.includes(this.#ctgName)) {
          this.visitCreateCategory()
          cy.inputFormGroup('Category Name', this.#ctgName)
          cy.clickButtonByName('Save Category')
          this.waitItcFetchCategories()
        }
      })
  }

  #searchInPopup(data, itcSearch) {
    itcSearch.set()
    cy.getPopup().within(() => {
      data.forEach((data) => {
        cy.typeInput(data)
        itcSearch.wait()

        cy.getCheckbox().first().check()
      })
      cy.clickButtonByName(Field.ADD)
    })
  }

  visitThenAddUsers(users = this.#addUsers) {
    this.visitManageCategories()
    this.addUsers(users)
  }

  addUsers(users = this.#addUsers) {
    cy.logInTestCase(`Add users to "${this.#ctgName}"`)

    this.setItcFetchCategoriesMembers()
    cy.clickLinkByName(this.#ctgName)
    this.waitItcFetchCategoriesMembers()

    cy.clickButtonByName('Add Member')

    this.setItcAddUsers()
    this.#searchInPopup(users, Itc.searchUsers)
    this.waitItcAddUsers()
    this.waitItcFetchCategoriesMembers()
  }

  addUserGroups(groups = this.#addUserGroups) {
    cy.logInTestCase(`Add user groups to "${this.#ctgName}"`)

    Itc.fetchUserGroups.set()
    cy.get('#_manageCategoriesPortlet_categoryDetail .dropdown-wrapper').within(() =>
      cy.clickDropdownItemInDropdownToggle('User Groups')
    )
    Itc.fetchUserGroups.wait()

    Itc.searchUserGroups.set()
    cy.clickButtonByName('Assign Group')
    Itc.searchUserGroups.wait()

    Itc.addUserGroups.set()
    this.#searchInPopup(groups, Itc.searchUserGroups)
    Itc.addUserGroups.wait()
  }

  clickAssignRole(email) {
    cy.rowName(email).within(($userRow) => {
      cy.wrap($userRow).getThreedotsIcon().click()
      cy.wrap($userRow).clickDropdownName('Assign Role')
    })
  }

  clickAdminRadio() {
    cy.getPopup().within(() => {
      cy.getElementWithLabel('Admin', 'label').parent('.mb-2').find('input').click()
    })
  }

  clickSave() {
    cy.clickButtonByName(Field.SAVE)
  }

  changeAdminRole() {
    if (this.#ctgObject.users.admins) {
      const emails = this.#ctgObject.users.admins
      emails.forEach((email) => {
        email = this.environment.isPrd() ? `${email}mail.com` : `${email}ethereal.email`

        cy.rowName(email)
          .invoke('text')
          .then((text) => {
            if (!text.includes('Admin')) {
              cy.logInTestCase(`Change admin ${email}`)
              this.clickAssignRole(email)
              this.clickAdminRadio()
              this.clickSave()

              this.waitItcAddUsers()
              this.waitItcFetchCategoriesMembers()
            }
          })
      })
    }
  }
}

class Itc {
  static searchUsers = new InterceptReq('/manage_categories/search_users', 'SearchUsers')
  static fetchUserGroups = new InterceptReq(
    '/manage_categories/user_groups/fetch',
    'FetchUserGroups'
  )
  static searchUserGroups = new InterceptReq(
    '/manage_categories/user_groups/search',
    'SearchUserGroups'
  )
  static addUserGroups = new InterceptReq('/category/user_groups/add', 'AddUserGroups')
}
export default SetUpCategory
