import Field from '../../../../../constants/Field'
import InstancePeopleItc from '../intercepts/InstancePeopleItc'
import InstancePeopleQueries from '../queries/InstancePeopleQueries'

export default class InstancePeopleActions extends InstancePeopleQueries {
  visit(courseId, instanceId) {
    InstancePeopleItc.getMembersCourse.set()
    cy.visit(super.getUrlOrgLms(courseId, instanceId))
    InstancePeopleItc.getMembersCourse.wait()
  }

  #clickButtonYesRemove() {
    InstancePeopleItc.removeMember.set()
    cy.swal2Confirm(Field.YES_REMOVE).click()
    InstancePeopleItc.removeMember.wait()
    cy.waitIconLoadingNotExist()
  }

  #clickButtonAddLearners() {
    InstancePeopleItc.searchUsersManagePeople.set()
    super.getButtonAddLearner().click()
    InstancePeopleItc.searchUsersManagePeople.wait()
  }

  #clickButtonAdd() {
    InstancePeopleItc.addManageMember.set()
    InstancePeopleItc.getMembersCourse.set()
    cy.clickButtonByName(Field.ADD)
    InstancePeopleItc.addManageMember.wait()
    cy.waitLoadingOverlayNotExist()
    InstancePeopleItc.getMembersCourse.wait()
  }

  #clickItemRemoveLearner(email) {
    super.getLearnerRow(email).within(($row) => {
      cy.wrap($row).clickDropdownItem(Field.REMOVE)
    })
  }

  #searchUserByNameThenSelect(name) {
    InstancePeopleItc.searchUsersManagePeople.set()
    super.getInputSearchUserByName().clear().type(name)
    cy.waitIconLoadingVisible()
    cy.waitIconLoadingNotExist()
    InstancePeopleItc.searchUsersManagePeople.wait()
    cy.getCheckbox().first().check()
  }

  removeLearner(email) {
    cy.waitLoadingOverlayNotExist()
    super
      .getLearnerTable()
      .invoke('text')
      .then(($text) => {
        if ($text.includes(email)) {
          this.#clickItemRemoveLearner(email)
          this.#clickButtonYesRemove()
        }
      })
  }

  addLearners(users) {
    this.#clickButtonAddLearners()
    cy.getPopup().within(() => {
      users.forEach((name) => {
        this.#searchUserByNameThenSelect(name)
        this.#clickButtonAdd()
      })
    })
  }

  addLearner(name) {
    this.#clickButtonAddLearners()
    cy.getPopup().within(() => {
      this.#searchUserByNameThenSelect(name)
      cy.getCheckbox().first().check()
      this.#clickButtonAdd()
    })
  }
}
