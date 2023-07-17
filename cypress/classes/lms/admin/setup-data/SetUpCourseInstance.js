import Environment from '../../../base/Environment'
import InterceptReq from '../../../base/InterceptReq'
import { CourseInstancesNav } from '../../base-manage-course/LmsAdminConstant'
import PublishUnPublishCourse from '../../PublishUnPublishCourse'
import CourseInstanceList from '../course-instance/CourseInstanceList'
import InstanceCreation from '../course-instance/InstanceCreation'
import ManageCourse from '../course/ManageCourse'
import CourseList from './CourseList'
import LmsAdminStub from './LmsAdminStub'
import SetupInstancePeople from './SetupInstancePeople'

class SetUpCourseInstance extends LmsAdminStub {
  courseInstanceList = new CourseInstanceList()
  env = new Environment()
  instanceCreation = new InstanceCreation()
  manageCourse = new ManageCourse()
  publishUnPublishCourse = new PublishUnPublishCourse()
  setupInstancePeople = new SetupInstancePeople()
  courseList = new CourseList()

  itcGetAdminMembers = new InterceptReq('/course/get_admin_members', 'GetAdminMembers')
  itcSearchUsersManagePeople = new InterceptReq(
    '/manage_people/users/search',
    'SearchUsersManagePeople'
  )
  itcAddManageMember = new InterceptReq('/manage_member/add', 'AddManageMember')
  itcFetchRecentThreads = new InterceptReq(
    '/forum/thread/fetch_recent_threads',
    'FetchRecentThreads'
  )

  fillInstanceInfoThenSave(courseName) {
    const {
      title,
      deliveryMethod,
      courseCompletion,
      expectedDuration,
      startDate,
      endDate,
      courseContactEmail,
      additionalBookingNote,
      courseFee,
      maxParticipant,
      mustBookBy,
      mustCancelBy,
    } = this.instanceObj

    cy.logInTestCase(`Create Instance "${this.instanceName}"`)

    this.instanceCreation.defineAliasFormElements(deliveryMethod, this.isCoP)

    cy.get('@inputInstanceTitle').type(this.instanceName)
    if (courseCompletion) cy.get('@inputCourseCompletion').type(courseCompletion)
    if (expectedDuration) cy.get('@inputExpectedDuration').type(expectedDuration)
    if (startDate) cy.get('@inputStartDate').type(startDate).blur()
    if (endDate) cy.get('@inputEndDate').type(endDate).blur()
    if (courseContactEmail) cy.get('@inputCourseEmail').type(courseContactEmail)
    if (additionalBookingNote) cy.get('@inputAdditionalNote').type(additionalBookingNote)
    if (courseFee) {
      cy.get('@inputCourseFee').type(courseFee.value)
      if (courseFee.paymentMethod)
        cy.get('@inputPaymentMethod').within(($dropdown) =>
          cy.wrap($dropdown).clickDropdownSelect(courseFee.paymentMethod)
        )
    }
    if (maxParticipant) cy.get('@inputMaxParticipants').clear().type(maxParticipant)
    if (mustBookBy) cy.get('@inputMustBookBy').type(mustBookBy)
    if (mustCancelBy) cy.get('@inputMustCancelBy').type(mustCancelBy)

    this.instanceCreation.clickSaveInstance(this.instanceName, courseName)
  }

  createNewInstanceThenPublishByID(courseId) {
    this.instanceCreation.visitCreateInstance(courseId)
    this.fillInstanceInfoThenSave(courseId)
    this.publishUnPublishCourse.publishCourseInstance()
  }

  createNewInstanceThenPublishByClickButton() {
    this.courseInstanceList.itcFetchCourseInstance.set()
    cy.clickLinkByName('Course Instances')
    this.courseInstanceList.itcFetchCourseInstance.wait()

    this._itcCourseInstanceOptions.set()
    cy.clickLinkByName('Create a new instance')
    this._itcCourseInstanceOptions.wait()

    this.fillInstanceInfoThenSave()
    this.publishUnPublishCourse.publishCourseInstanceWithoutActivity()
  }

  clickViewDiscussionFrom3dots() {
    this.itcFetchRecentThreads.set()
    cy.getElementWithLabel(this.instanceName, 'span')
      .parents('tr')
      .within((instanceRow) => {
        cy.wrap(instanceRow).clickDropdownItem('View Discussion')
      })
    this.itcFetchRecentThreads.wait()
  }

  clickCreateInstanceFrom3dots() {
    this.instanceCreation._itcCourseInstanceOptions.set()
    cy.get('@manageCourseCard')
      .get('.pull-right')
      .eq(1)
      .within(($threeDots) => {
        cy.wrap($threeDots).clickDropdownItem('Create an instance')
      })
    this.instanceCreation._itcCourseInstanceOptions.wait()
  }

  searchInstance() {
    cy.inputByPlaceholder('Search courses', `"${this.instanceName}"{enter}`)
    this.manageCourse.waitItcFetchManageCourse()
    cy.waitLoadingOverlayNotExist()
  }

  createNewInstanceFromManageCourse(course, instance) {
    course ? this.courseList.setCourse(course) : this.courseList.setCourse(this.courseObj)
    instance ? this.setInstanceObject(instance) : ''
    this.courseList.visitThenSearchCourse(this.isCoP)
    cy.get('@manageCourseCard')
      .invoke('text')
      .then((text) => {
        if (!text.includes(this.instanceName)) {
          this.clickCreateInstanceFrom3dots()
          this.fillInstanceInfoThenSave()
        }
      })
  }

  createNewInstanceFromManageCourseThenAddPeople(course, instance) {
    course ? this.courseList.setCourse(course) : this.courseList.setCourse(this.courseObj)
    instance ? this.setInstanceObject(instance) : ''

    const { managePeople } = this.instanceObj

    this.courseList.visitThenSearchCourse()
    cy.get('@manageCourseCard')
      .invoke('text')
      .then((text) => {
        if (!text.includes(this.instanceName)) {
          this.clickCreateInstanceFrom3dots()
          this.fillInstanceInfoThenSave()
          if (managePeople) {
            this.setupInstancePeople.setInstancePeopleYaml(this.instanceObj)
            if (managePeople.faci) this.addFacilitators()
            if (managePeople.members) this.setupInstancePeople.addUsers()
            if (managePeople.learners) this.setupInstancePeople.addUsers(managePeople.learners)
          }
        }
      })
  }

  addFacilitators() {
    this.itcGetAdminMembers.set()
    this.itcAddManageMember.set()
    this.itcSearchUsersManagePeople.set()

    const users = this.instanceObj.managePeople.faci
    cy.logInTestCase(`Add users to "${this.instanceName}"`)

    cy.getElementWithLabel(CourseInstancesNav.PEOPLE, 'a.cec-sidebar__nav-link').click()
    this.itcGetAdminMembers.wait()
    cy.clickButtonByName('Add Facilitators')

    cy.getPopup().within(() => {
      users.forEach((faci) => {
        cy.inputByPlaceholder('Search users by name', faci)
        this.itcSearchUsersManagePeople.wait()

        cy.wait(1000)
        cy.getCheckbox().first().check()
      })
      cy.clickButtonByName('Add')
    })
    this.itcAddManageMember.wait()
  }

  createNewInstanceThenPublishFromManageCourse(course, instance) {
    course ? this.courseList.setCourse(course) : this.courseList.setCourse(this.courseObj)
    instance ? this.setInstanceObject(instance) : ''
    const { managePeople } = this.instanceObj

    this.courseList.visitThenSearchCourse(this.isCoP)
    cy.get('@manageCourseCard')
      .invoke('text')
      .then((text) => {
        if (!text.includes(this.instanceName)) {
          this.clickCreateInstanceFrom3dots()
          this.fillInstanceInfoThenSave(course.name)
          this.publishUnPublishCourse.publishCourseInstanceWithoutActivity()
          if (managePeople) {
            if (managePeople.faci) this.addFacilitators()
          }
        }
      })
  }

  goToDiscussions() {
    this.courseList.setCourse(this.courseObj)
    this.courseList.visitThenSearchCourse()
    this.clickViewDiscussionFrom3dots()
  }
}
export default SetUpCourseInstance
