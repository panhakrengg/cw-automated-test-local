import Field from '../../../constants/Field'
import { CourseInstanceNav } from '../../base/constant/AdminNavigationConstant'
import { PeopleLabel, PeoplePlaceholder } from '../constant/PeopleConstant'
import PeopleItc from '../intercepts/PeopleItc'

class PeopleActions {
  clickNavPeople() {
    PeopleItc.getMembersCourse.set()
    PeopleItc.getAdminMembersCourse.set()
    cy.cardRightContent().within(() => cy.clickLinkByName(CourseInstanceNav.PEOPLE))
    PeopleItc.getMembersCourse.wait()
    PeopleItc.getAdminMembersCourse.wait()
  }

  #clickButtonAddLearners() {
    PeopleItc.searchUsersManagePeople.set()
    cy.clickButtonByName(PeopleLabel.ADD_LEARNERS)
    PeopleItc.searchUsersManagePeople.wait()
  }

  #searchUser(user) {
    PeopleItc.searchUsersManagePeople.set()
    cy.inputByPlaceholder(PeoplePlaceholder.SEARCH_USER_BY_NAME, user)
    PeopleItc.searchUsersManagePeople.wait()
  }

  #checkFirstUserInPopup() {
    cy.getCheckbox().first().check()
  }

  #searchThenCheckUsers(users) {
    users.forEach((user) => {
      this.#searchUser(user)
      this.#checkFirstUserInPopup()
    })
  }

  #clickButtonAdd() {
    PeopleItc.getMembersCourse.set()
    cy.clickButtonByName(Field.ADD)
    cy.waitLoadingOverlayNotExist()
    PeopleItc.getMembersCourse.wait()
  }

  addLearnerByClickingPeopleNav(learners) {
    this.clickNavPeople()
    this.#clickButtonAddLearners()
    cy.getPopup().within(() => {
      this.#searchThenCheckUsers(learners)
      this.#clickButtonAdd()
    })
  }
}
export default PeopleActions
