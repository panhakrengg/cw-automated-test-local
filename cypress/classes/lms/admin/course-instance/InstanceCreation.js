import Environment from '../../../base/Environment'
import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import { OrgConst } from '../../../org-management/base-org-management/OrgStub'
import { CourseFee } from '../../base-manage-course/CourseFeeConstant'
import { DeliveryMethod } from '../../base-manage-course/DeliveryMethodConstant'
import { CreationInstanceLabel } from './base-course-instance/CourseInstanceConstant'
import ManagePeopleInstance from './ManagePeopleInstance'

class InstanceCreation {
  managePeople = new ManagePeopleInstance()

  _itcCourseInstanceOptions = new InterceptReq(
    '/manage_courses/course_instance/options',
    'CourseInstanceOptions'
  )
  _itcUpdateInstance = new InterceptReq('/manage_courses/course_instance/modify', 'updateInstance')

  getCreateInstanceUrl(courseId) {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_learningAdminManageCoursesPortlet_id=0&_learningAdminManageCoursesPortlet_tab=edit-course-instance&_learningAdminManageCoursesPortlet_courseId=${courseId}`
  }

  visitCreateInstance(courseId) {
    this._itcCourseInstanceOptions.set()
    cy.visit(this.getCreateInstanceUrl(courseId))
    this._itcCourseInstanceOptions.wait()
  }

  defineAliasFormElements(deliveryMethod, isCoP = false) {
    cy.cardMainContent().within(() => {
      cy.getElementWithLabel(deliveryMethod, '.delivery-method').as('chooseDeliveryMethod').click()
      cy.getElementByLabel(CreationInstanceLabel.INSTANCE_TITLE).as('inputInstanceTitle')
      cy.getElementByLabel(CreationInstanceLabel.LANGUAGE).as('dropdownLanguage')
      cy.getElementByLabel(CreationInstanceLabel.COURSE_COMPLETION).as('inputCourseCompletion')
      cy.getElementByLabel(CreationInstanceLabel.EXPECTED_DURATION).as('inputExpectedDuration')
      if (deliveryMethod != DeliveryMethod.SELF_STUDY) {
        cy.getElementByLabel(CreationInstanceLabel.TIME_ZONE).as('dropdownTimeZone')
        cy.getElementByLabel(CreationInstanceLabel.START_DATE).find('input').as('inputStartDate')
        cy.getElementByLabel(CreationInstanceLabel.END_DATE).find('input').as('inputEndDate')
        cy.getElementByLabel(CreationInstanceLabel.MAX_PARTICIPANTS).as('inputMaxParticipants')
        cy.getElementByLabel(CreationInstanceLabel.MUST_BOOK_BY).as('inputMustBookBy')
        cy.getElementByLabel(CreationInstanceLabel.MUST_CANCEL_BY).as('inputMustCancelBy')
      }
      cy.getElementByLabel(CreationInstanceLabel.COURSE_CONTACT_EMAIL).as('inputCourseEmail')
      cy.getElementByLabel(CreationInstanceLabel.ADDITIONAL_NOTE).as('inputAdditionalNote')
      cy.getElementByLabel(CourseFee.COURSE_FEE).as('inputCourseFee')
      if (!isCoP) cy.getElementByLabel(CourseFee.PAYMENT_METHOD).parent().as('inputPaymentMethod')
    })
  }

  clickAddFacilitatorButton() {
    cy.clickLinkByName(CreationInstanceLabel.ADD_FACILITATOR)
  }

  searchThenAddFacilitator(users) {
    this.managePeople._itcFetchUsersInstance.set()

    cy.getPopup().within(() => {
      users.forEach((faci) => {
        cy.inputByPlaceholder('Search', faci)
        this.managePeople._itcFetchUsersInstance.wait()

        cy.getCheckbox().first().check()
      })
      cy.clickButtonByName(Field.ADD)
    })
  }

  addFacilitator(users) {
    this.clickAddFacilitatorButton()
    this.searchThenAddFacilitator(users)
  }

  #getInstanceId(InstanceName, courseName = '') {
    cy.url().then((url) => {
      url = url.split('CoursesPortlet_id=').pop().split('&_learningAdmin')[0]
      cy.log(
        `InstanceId in ${new Environment().getEnvPrefix()} "${courseName}" has '${InstanceName}' - ${url}`
      )
    })
  }

  clickSaveInstance(instanceName, courseName) {
    this._itcUpdateInstance.set()
    cy.clickButtonByName(CreationInstanceLabel.SAVE_INSTANCE)
    this._itcUpdateInstance.wait()
    cy.waitLoadingOverlayNotExist()
    if (instanceName) this.#getInstanceId(instanceName, courseName)
  }
}
export default InstanceCreation
