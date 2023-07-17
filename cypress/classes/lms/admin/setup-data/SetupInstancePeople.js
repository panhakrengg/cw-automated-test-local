import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'

class SetupInstancePeople {
  itcGetMembersCourse = new InterceptReq('/course/get_members', 'GetMembersCourse')
  itcGetAdminMembersCourse = new InterceptReq('/course/get_admin_members', 'GetAdminMembersCourse')
  itcSearchUsersManagePeople = new InterceptReq(
    '/manage_people/users/search',
    'SearchUsersManagePeople'
  )
  itcAddManageMember = new InterceptReq('/manage_member/add', 'AddManageMember')
  itcDetailMemberStatus = new InterceptReq(
    '/course_instance/member_status/detail',
    'DetailMemberStatus'
  )
  itcUpdateMemberStatus = new InterceptReq(
    '/course_instance/member_status/update',
    'UpdateMemberStatus'
  )

  setAllIntercepts() {
    this.itcGetAdminMembersCourse.set()
    this.itcGetMembersCourse.set()
    this.itcSearchUsersManagePeople.set()
    this.itcAddManageMember.set()
  }

  clickPeopleTab() {
    cy.url().then((url) => {
      const peopleUrl = `${url}#_learningAdminManageCoursesPortlet_tab=people`
      if (!url.includes('_learningAdminManageCoursesPortlet_tab=people')) {
        cy.visit(peopleUrl)
        this.itcGetMembersCourse.wait()
        this.itcGetAdminMembersCourse.wait()
      }
    })
  }

  clickAddLearners() {
    cy.clickButtonByName('Add Learners')
    cy.waitIconLoadingNotExist()
    this.itcSearchUsersManagePeople.wait()
  }

  clickAddFacilitators() {
    cy.clickButtonByName('Add Facilitators')
    cy.waitIconLoadingNotExist()
    this.itcSearchUsersManagePeople.wait()
  }

  clickAddFaciInPopup() {
    cy.clickButtonByName(Field.ADD)
    this.itcAddManageMember.wait()
    this.itcGetAdminMembersCourse.wait()
  }

  clickAddInPopup() {
    cy.clickButtonByName(Field.ADD)
    this.itcAddManageMember.wait()
    this.itcGetMembersCourse.wait()
  }

  searchAndSelectFaci(faci) {
    cy.getPopup().within(() => {
      faci.forEach((user) => {
        cy.inputByPlaceholder('Search users by name', user)
        this.itcSearchUsersManagePeople.wait()

        cy.getCheckbox().first().check()
      })
      this.clickAddFaciInPopup()
    })
  }

  searchAndSelectUsers(learners) {
    const users = learners ? learners : this.instancePeople.members

    cy.getPopup().within(() => {
      users.forEach((user) => {
        cy.inputByPlaceholder('Search users by name', user)
        this.itcSearchUsersManagePeople.wait()

        cy.getCheckbox().first().check()
      })
      this.clickAddInPopup()
    })
  }

  setInstancePeopleYaml(instanceObj) {
    this.instancePeople = instanceObj.managePeople
  }

  addUsers(learners) {
    this.setAllIntercepts()
    this.clickPeopleTab()
    this.clickAddLearners()
    this.searchAndSelectUsers(learners)
  }

  addFaci(faci) {
    this.setAllIntercepts()
    this.clickPeopleTab()
    this.clickAddFacilitators()
    this.searchAndSelectFaci(faci)
  }

  #clickChangeLearningStatus(email) {
    cy.rowName(email).within(($userRow) => {
      this.itcDetailMemberStatus.set()
      cy.wrap($userRow).clickDropdownItem('Change Learning Status')
      this.itcDetailMemberStatus.wait()
    })
  }

  #clickChangeStatus() {
    this.itcUpdateMemberStatus.set()
    cy.clickButtonByName('Change')
    this.itcUpdateMemberStatus.wait()
    this.itcGetMembersCourse.wait()
  }

  changeStatus(email, status) {
    cy.logInTestCase(`Change course status ${email} to ${status}`)

    this.#clickChangeLearningStatus(email)
    cy.clickCwDropdownItem(status)
    this.#clickChangeStatus()
  }
}
export default SetupInstancePeople
