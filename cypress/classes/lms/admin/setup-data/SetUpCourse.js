import Environment from '../../../base/Environment'
import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import CourseCreation from '../../CourseCreation'
import PublishUnPublishCourse from '../../PublishUnPublishCourse'
import { CourseNav, LmsAdminRole } from '../../base-manage-course/LmsAdminConstant'
import ManageCourse from '../course/ManageCourse'
import ManagePeopleCourse from '../course/ManagePeopleCourse'
import LmsAdminStub from './LmsAdminStub'

class SetUpCourse extends LmsAdminStub {
  #itcSearchUsers = new InterceptReq('/manage_people/users/search', 'SearchUsers')
  #itcAddMember = new InterceptReq('/manage_member/add', 'AddMember')
  #itcFetchSharingItemsCourse = new InterceptReq(
    '/course/sharing_items/fetch',
    'FetchSharingItemsCourse'
  )

  env = new Environment()

  publishUnPublishCourse = new PublishUnPublishCourse()
  managePeopleCourse = new ManagePeopleCourse()
  manageCourse = new ManageCourse()
  courseCreation = new CourseCreation()

  setCourseObject(object) {
    const { name } = object
    this.courseObj = object
    this.courseName = name.value ? name.value : name
  }

  addCategories(categories) {
    cy.getElementWithLabel('Select Categories', 'button').click()
    cy.swal2().within(() => {
      categories.forEach((category) => {
        cy.checkboxByLabel(category).check()
      })
      cy.clickButtonByName(Field.ADD)
    })
  }

  getCreateCoPCourseUrl() {
    return `${this.trainingCoPObj.url}/admin/admin?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fmanage_courses%2Fnew_course`
  }

  #accessCategories(categories) {
    cy.getElementWithLabel('Categories', '.item-selection').find('.add-icon').click()
    cy.getPopup().within(() => {
      categories.forEach((category) => {
        cy.checkboxByLabel(category).check()
      })
      cy.clickButtonByName(Field.ADD)
    })
  }

  createNewCourse() {
    const {
      image,
      courseOverview,
      uploadFile,
      uploadFiles,
      courseFee,
      categories,
      courseCompletion,
    } = this.courseObj

    cy.logInTestCase(`Create course "${this.courseName}"`)

    if (this.isCoP) {
      this.courseCreation.goToCreateCoursePage(this.getCreateCoPCourseUrl())
    } else {
      this.courseCreation.goToCreateCoursePage()
    }
    this.courseCreation.defineAliasFormElements()

    cy.get('@inputCourseTitle').type(this.courseName)
    if (image) this.courseCreation.uploadCourseBanner(image)
    cy.get('@courseOverviewWrapper').typeInEditor(courseOverview)
    if (uploadFile) cy.uploadFile(uploadFile, Itc.uploadTempFile)
    if (uploadFiles) {
      uploadFiles.path.forEach((path) => {
        cy.uploadFile(path, Itc.uploadTempFile)
      })
    }
    if (courseFee) cy.get('@courseFee').typeInput(courseFee.value, 'number')
    if (categories) {
      this.#accessCategories(categories)
    }
    if (courseCompletion) {
      cy.getElementWithLabel('Award learners with a certificate', '.text-noselect')
        .find('.cw-toggle-button')
        .click()
    }
    this.courseCreation.triggerSaveAsDraft(this.courseName)
  }

  searchCourse() {
    cy.inputByPlaceholder('Search courses', `"${this.courseName}"{enter}`)
    this.manageCourse.waitItcFetchManageCourse()
    cy.waitLoadingOverlayNotExist()
  }

  selectAllInstances() {
    cy.get('.cw-learning-dropdown__wrapper').first().clickCwSplitDropdownToggle(Field.ALL)
    this.manageCourse.waitItcFetchManageCourse()
  }

  createNewCourseThenPublish() {
    const { communitySharing } = this.courseObj
    this.createNewCourse()
    this.publishUnPublishCourse.publish()
    if (communitySharing) if (communitySharing.communitySharing) this.#enableCommunitySharing()
  }

  createNewCourseThenShare() {
    const { requirePermission } = this.courseObj.communitySharing
    this.createNewCourse()
    this.#enableCommunitySharing()
    if (requirePermission) this.#enableRequirePermission()
  }

  createNewCourseThenPublishAndShare(communitySharing) {
    const { requirePermission } = communitySharing
    this.createNewCourse()
    this.publishUnPublishCourse.publish()
    this.#enableCommunitySharing()
    if (requirePermission) this.#enableRequirePermission()
  }

  #clickCommunitySharingSidebar() {
    this.#itcFetchSharingItemsCourse.set()
    cy.clickLinkByName('Community Sharing')
    this.#itcFetchSharingItemsCourse.wait()
  }

  #enableCommunitySharing() {
    this.#clickCommunitySharingSidebar()
    cy.get('.course-sharing').within(($course) => {
      cy.wrap($course).toggleSwitch()
    })
    cy.wait(500)
    cy.waitUntilToastDisappear()
  }

  #enableRequirePermission() {
    cy.getElementWithLabel('Require permission', 'h5')
      .parents('div.justify-content-between')
      .as('requirePermission')

    cy.get('@requirePermission')
      .invoke('text')
      .then((text) => {
        if (text.includes('Disabled')) {
          cy.get('@requirePermission').within(($permission) => {
            cy.wrap($permission).toggleSwitch()
          })
          cy.wait(500)
          cy.waitUntilToastDisappear()
        }
      })
  }

  addUsers() {
    const users = this.courseObj.managePeople.addUsers

    cy.logInTestCase(`Add users to "${this.courseName}"`)

    cy.getElementWithLabel(CourseNav.PEOPLE, 'a.cec-sidebar__nav-link').click()
    this.managePeopleCourse._itcGetMembers.set()
    cy.clickButtonByName('Add Users')

    this.managePeopleCourse.addUsersInPopup(users, role)
  }

  addFacilitators() {
    const users = this.courseObj.managePeople.faci
    cy.logInTestCase(`Add users to "${this.courseName}"`)

    cy.getElementWithLabel(CourseNav.PEOPLE, 'a.cec-sidebar__nav-link').click()
    this.managePeopleCourse._itcGetMembers.set()
    cy.clickButtonByName('Add Users')

    this.searchThenAddRole(users, 'Facilitator')
  }
  addAdmins() {
    const users = this.courseObj.managePeople.admins
    cy.logInTestCase(`Add users to "${this.courseName}"`)

    cy.getElementWithLabel(CourseNav.PEOPLE, 'a.cec-sidebar__nav-link').click()
    this.managePeopleCourse._itcGetMembers.set()
    cy.waitLoadingOverlayNotExist()
    cy.clickButtonByName('Add Users')

    this.searchThenAddRole(users, 'Course Administrator')
  }

  searchThenAddRole(users, role) {
    this.#itcAddMember.set()
    this.#itcSearchUsers.set()

    cy.wait(1000)
    cy.getPopup().within(() => {
      users.forEach((user) => {
        cy.inputByPlaceholder('Search users by name', user)
        cy.wait(1000)
        this.#itcSearchUsers.wait()
        cy.waitIconLoadingNotExist()
        cy.getCheckbox().first().check()
      })
      cy.clickButtonByName(Field.NEXT)
      cy.getElementWithLabel(role, 'label').click()
      cy.clickButtonByName(Field.ADD)
    })
    this.#itcAddMember.wait()
    this.managePeopleCourse._itcGetMembers.wait()
  }

  changeRole(emails, role) {
    this.managePeopleCourse._itcUpdateUserRole.set()
    this.managePeopleCourse._itcGetMembers.wait()

    emails.forEach((email) => {
      email = this.env.isPrd() ? `${email}mail.com` : `${email}ethereal.email`
      cy.logInTestCase(`Change admin ${email}`)

      cy.rowName(email).within(($userRow) => {
        cy.wrap($userRow).clickDropdownItem('Change Role')
      })
      cy.clickCwDropdownItem(role)
      cy.clickButtonByName('Change')

      this.managePeopleCourse._itcUpdateUserRole.wait()
      this.managePeopleCourse._itcGetMembers.wait()
    })
  }

  changeAdminRole() {
    const emails = this.courseObj.managePeople.adminEmails
    this.changeRole(emails, LmsAdminRole.COURSE_ADMIN)
  }
  changeFacilitatorRole() {
    const emails = this.courseObj.managePeople.faciEmails
    this.changeRole(emails, LmsAdminRole.FACILITATOR)
  }
}

class Itc {
  static uploadTempFile = new InterceptReq('/manage_courses/temp_file/upload', 'UploadTempFile')
}
export default SetUpCourse
