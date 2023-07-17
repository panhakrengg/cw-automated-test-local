import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import ManageCourse from '../course/ManageCourse'

class CourseList {
  manageCourse = new ManageCourse()

  itcCourseProperties = new InterceptReq('/course/properties', 'CourseProperties')
  itcDuplicateInstance = new InterceptReq('/manage_courses/duplicate_instance', 'DuplicateInstance')
  itcGetMembersCourse = new InterceptReq('/course/get_members', 'GetMembersCourse')

  setCourse(object) {
    this.courseObj = object
    const { name, trainingCoP } = this.courseObj
    this.courseName = name.value ? name.value : name
    if (trainingCoP) this.trainingCoPObj = trainingCoP
  }

  setInstanceName(name) {
    this.instanceName = name
  }

  getCoPCourseAdmin() {
    return `${this.trainingCoPObj.url}/admin/admin#_copMemberManagementPortlet_option=manage-courses`
  }

  visit(isCoP = false) {
    this.manageCourse.setCourseName(this.courseName)
    isCoP
      ? this.manageCourse.visitManageCourse(this.getCoPCourseAdmin())
      : this.manageCourse.visitManageCourse()
  }

  selectAllInstances() {
    this.manageCourse.setItcFetchManageCourse()
    cy.get('.cw-learning-dropdown__wrapper').first().clickCwSplitDropdownToggle(Field.ALL)
    this.manageCourse.waitItcFetchManageCourse()
  }

  searchCourse(name) {
    this.courseName = name ? name : this.courseName
    cy.inputByPlaceholder('Search courses', `"${this.courseName}"{enter}`)
    this.manageCourse.waitItcFetchManageCourse()
    cy.waitLoadingOverlayNotExist()
    this.manageCourse.defineAliasCourseCard()
  }

  clickCourseName(name) {
    this.courseName = name ? name : this.courseName
    this.itcCourseProperties.set()
    cy.clickLinkByName(this.courseName)
    this.itcCourseProperties.wait()
  }

  visitThenSearchCourse(isCoP, name) {
    this.visit(isCoP)
    this.selectAllInstances()
    this.searchCourse(name)
  }

  click3dotsInstance(item, instanceTitle) {
    this.instanceName = instanceTitle ? instanceTitle : this.instanceName
    cy.log(instanceTitle)
    cy.log(this.instanceName)
    cy.getElementWithLabel(this.instanceName, 'tr').within((instanceRow) => {
      cy.wrap(instanceRow).clickDropdownItem(item)
    })
  }

  clickDuplicateFrom3dotsInstance() {
    this.itcDuplicateInstance.set()
    this.click3dotsInstance(Field.DUPLICATE)
    this.itcDuplicateInstance.wait()
  }

  goToInstancePeopleFromCourseList(instanceTitle) {
    this.selectAllInstances()
    this.searchCourse(instanceTitle)
    this.#clickPeopleFrom3dotsInstance(instanceTitle)
  }

  #clickPeopleFrom3dotsInstance(instanceTitle) {
    this.itcGetMembersCourse.set()
    this.click3dotsInstance('People', instanceTitle)
    this.itcGetMembersCourse.wait()
  }
}
export default CourseList
