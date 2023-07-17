import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'
import { ModifyCourseConstant } from '../constant/ModifyCourseConstant'

export default class ModifyCourseQueries {
  getUrlCreateCourseOrgLms() {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fmanage_courses%2Fnew_course`
  }

  getUrlCreateCourseCop(copUrl) {
    return `${copUrl}/admin/admin?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fmanage_courses%2Fnew_course`
  }

  getUrlEditCourseOrgLms(courseId) {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=edit-course`
  }

  getUrlEditCourseCop(copUrl, courseId) {
    return `${copUrl}/admin/admin?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_copMemberManagementPortlet_id=${courseId}&_copMemberManagementPortlet_tab=edit-course`
  }

  getInputCourseTitle() {
    return cy.getInputByPlaceholder(ModifyCourseConstant.ENTER_THE_TITLE_OF_COURSE)
  }

  getButtonAddCourseImage() {
    return cy.getButtonByName(ModifyCourseConstant.ADD_A_COURSE_IMAGE)
  }

  getButtonChangePhoto() {
    return cy.getButtonByName(ModifyCourseConstant.CHANGE_PHOTO)
  }

  getImageWrapper() {
    return cy.get('.cw-form-image-wrapper > .image__wrapper')
  }

  getInputCourseFee() {
    return cy.getInputFormGroup(ModifyCourseConstant.COURSE_FEE)
  }

  getSelectPaymentMethod() {
    return cy.getInputFormGroup('Course Fee')
  }

  getIconPlusInAccessCategories() {
    return cy.getElementWithLabel('Categories', '.item-selection').find('.add-icon')
  }

  getToggleAwardLearnersCertificate() {
    return cy
      .getElementWithLabel(ModifyCourseConstant.AWARD_LEARNERS_WITH_CERTIFICATE, '.cec-px-6')
      .cwToggleButton()
  }

  getToggleAddingToProfile() {
    return cy
      .getElementWithLabel(ModifyCourseConstant.ALLOW_ADDING_PROFILE, '.cec-pl-6')
      .cwToggleButton()
  }

  #getToggleCollaboration(name) {
    return cy.getElementWithLabel(name, '.d-flex').find('.mr-1').cwToggleButton()
  }

  getToggleEnableConnect() {
    return this.#getToggleCollaboration(ModifyCourseConstant.ENABLE_CONNECT)
  }

  getToggleEnableDiscussion() {
    return this.#getToggleCollaboration(ModifyCourseConstant.ENABLE_DISCUSSION)
  }

  #isToggleTurnOn(subject) {
    subject
      .find('input')
      .invoke('prop', 'checked')
      .then(($enable) => cy.wrap($enable).as('toggleEnable'))
    return cy.get('@toggleEnable')
  }

  isToggleAwardLearnersCertificateOn() {
    this.#isToggleTurnOn(this.getToggleAwardLearnersCertificate()).then(($enable) =>
      cy.wrap($enable).as('toggleAwardLearnersCertificateOn')
    )
    return cy.get('@toggleAwardLearnersCertificateOn')
  }

  isToggleOnAddingToProfile() {
    this.#isToggleTurnOn(this.getToggleAddingToProfile()).then(($enable) =>
      cy.wrap($enable).as('toggleAddingToProfileOn')
    )
    return cy.get('@toggleAddingToProfileOn')
  }

  isToggleOnEnableConnect() {
    this.#isToggleTurnOn(this.getToggleEnableConnect()).then(($enable) =>
      cy.wrap($enable).as('toggleEnableConnect')
    )
    return cy.get('@toggleEnableConnect')
  }

  isToggleOnEnableDiscussion() {
    this.#isToggleTurnOn(this.getToggleEnableDiscussion()).then(($enable) =>
      cy.wrap($enable).as('toggleEnableDiscussion')
    )
    return cy.get('@toggleEnableDiscussion')
  }

  getButtonSaveAsDraft() {
    return cy.getButtonByName(ModifyCourseConstant.SAVE_AS_DRAFT).first()
  }

  getButtonSaveCourse() {
    return cy.getButtonByName(ModifyCourseConstant.SAVE_Course).first()
  }

  foundUploadFile(subject) {
    return subject.find('.cw-icon-trash').length
  }

  foundCategory(subject) {
    return subject.find('.item .cw-icon-tn').length
  }

  getIconTrash() {
    return cy.get('.cw-icon-trash')
  }

  getIconX() {
    return cy.get('.item .cw-icon-tn')
  }
}
