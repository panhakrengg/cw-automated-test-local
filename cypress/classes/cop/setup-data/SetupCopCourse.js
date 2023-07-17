import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import SignInAs from '../../utilities/SignInAs'

class SetupCopCourse {
  constructor() {
    this.login = new LoginToCourses()
  }

  #clickButtonCreateNewCourse() {
    cy.clickButtonByName('Create New Course')
  }
  #clickCardAddExistingCourse() {
    cy.getElementWithLabel('Add Existing Course', '.font-weight-bold').click()
  }
  #clickButtonNext() {
    Intercepts.searchSharedCourses.set()
    cy.clickButtonByName(Field.NEXT)
    Intercepts.searchSharedCourses.wait()
  }
  #searchCourse(name) {
    cy.inputByPlaceholder('Search', `"${name}"`)
  }
  #clickCourseInPopup(name) {
    cy.getElementWithLabel(name, '.font-weight-bold').click()
  }
  #clickButtonAdd() {
    cy.clickButtonByName(Field.ADD)
  }

  addExistingCourse(courseName) {
    Intercepts.fetchCourseManageCourses.set()
    Intercepts.fetchPermissionAdmin.set()
    this.#clickButtonCreateNewCourse()
    cy.swal2().within(() => {
      this.#clickCardAddExistingCourse()
      this.#clickButtonNext()
      this.#searchCourse(courseName)
      this.#clickCourseInPopup(courseName)
      this.#clickButtonAdd()
    })
    Intercepts.fetchCourseManageCourses.wait()
    Intercepts.fetchPermissionAdmin.wait()
  }
}

class LoginToCourses {
  #getCoursesUrl(copUrl) {
    return `${copUrl}/admin/admin/#_copMemberManagementPortlet_option=manage-courses`
  }

  asOrgAdminAmy(copUrl) {
    Intercepts.fetchTotalManageCourse.set()
    Intercepts.fetchManageCourse.set()
    SignInAs.orgAdmin_Amy(this.#getCoursesUrl(copUrl))
    Intercepts.fetchTotalManageCourse.wait()
    Intercepts.fetchManageCourse.wait()
  }
}

class Intercepts {
  static fetchTotalManageCourse = new InterceptReq(
    '/manage_courses/fetch_total',
    'FetchTotalManageCourse'
  )

  static fetchManageCourse = new InterceptReq('/manage_courses/fetch', 'FetchManageCourse')

  static searchSharedCourses = new InterceptReq(
    '/admin/shared_courses/search',
    'SearchSharedCourses'
  )

  static fetchCourseManageCourses = new InterceptReq(
    '/manage_courses/fetch_course',
    'FetchCourseManageCourses'
  )

  static fetchPermissionAdmin = new InterceptReq('/admin/permission/fetch', 'FetchPermissionAdmin')
}

export default SetupCopCourse
