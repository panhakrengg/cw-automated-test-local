import Field from '../../../../constants/Field'
import { ModifyCourseConstant } from '../constant/ModifyCourseConstant'
import ModifyCourseItc from '../intercepts/ModifyCourseItc'
import ModifyCourseQueries from '../queries/ModifyCourseQueries'

export default class ModifyCourseActions extends ModifyCourseQueries {
  visitCreateCourseOrgLms() {
    cy.visit(super.getUrlCreateCourseOrgLms())
  }

  visitCreateCourseCop() {
    cy.visit(super.getUrlCreateCourseCop())
  }

  #uploadCourseImage(imagePath, isEdit) {
    if (isEdit) super.getImageWrapper().realHover()
    const button = isEdit ? super.getButtonChangePhoto() : super.getButtonAddCourseImage()
    button.chooseFile(imagePath)
    cy.wait(1000)
    cy.swal2().within(() => cy.clickPrimaryButton(Field.SAVE))
    super.getImageWrapper().within(() => {
      cy.scrollTo('top') //Hack to show the lazy load banner image
      cy.get('> img')
        .should('be.visible')
        .and('have.prop', 'naturalWidth')
        .should('be.greaterThan', 0)
    })
  }

  #accessCategories(categories) {
    super.getIconPlusInAccessCategories().click()
    cy.getPopup().within(() => {
      categories.forEach((category) => {
        cy.checkboxByLabel(category).check()
      })
      cy.clickButtonByName(Field.ADD)
    })
  }

  #uploadFiles(paths) {
    paths.forEach((path) => {
      cy.uploadFile(path, ModifyCourseItc.uploadTempFile)
    })
  }

  #fillCourseTitle(title) {
    super.getInputCourseTitle().clear().type(title)
  }

  #clickButtonSaveAsDraft() {
    ModifyCourseItc.modifyCourse.set()
    ModifyCourseItc.fetchCourse.set()
    super.getButtonSaveAsDraft().click()
    ModifyCourseItc.modifyCourse.wait()
    ModifyCourseItc.fetchCourse.wait()
  }

  #clickButtonSaveCourse() {
    ModifyCourseItc.modifyCourse.set()
    ModifyCourseItc.fetchCourse.set()
    super.getButtonSaveCourse().click()
    ModifyCourseItc.modifyCourse.wait()
    ModifyCourseItc.fetchCourse.wait()
  }

  #fillCourseFee(courseFee) {
    const { value, paymentMethod } = courseFee
    super.getInputCourseFee().clear().type(value)
    if (paymentMethod) cy.clickDropdownSelect(paymentMethod)
  }

  #turnOnEnableConnect() {
    super.isToggleOnEnableConnect().then(($enable) => {
      if (!$enable) super.getToggleEnableConnect().toggleSwitch()
    })
  }

  #turnOffEnableConnect() {
    super.isToggleOnEnableConnect().then(($enable) => {
      if ($enable) super.getToggleEnableConnect().click()
    })
  }

  #turnOnEnableDiscussion() {
    super.isToggleOnEnableDiscussion().then(($enable) => {
      if (!$enable) super.getToggleEnableDiscussion().click()
    })
  }

  #turnOffEnableDiscussion() {
    super.isToggleOnEnableDiscussion().then(($enable) => {
      if ($enable) super.getToggleEnableDiscussion().click()
    })
  }

  #turnOnAwardLearnerCertificate() {
    super.isToggleAwardLearnersCertificateOn().then(($enable) => {
      if (!$enable) super.getToggleAwardLearnersCertificate().click()
    })
  }

  #turnOffAwardLearnerCertificate() {
    super.isToggleAwardLearnersCertificateOn().then(($enable) => {
      if ($enable) super.getToggleAwardLearnersCertificate().click()
    })
  }

  #turnOnAllowAddingToProfile() {
    super.isToggleOnAddingToProfile().then(($enable) => {
      if (!$enable) super.getToggleAddingToProfile().click()
    })
  }

  #turnOffAllowAddingToProfile() {
    super.isToggleOnAddingToProfile().then(($enable) => {
      if ($enable) super.getToggleAddingToProfile().click()
    })
  }

  #selectWhoLearnerCanSee(label) {
    cy.clickCwDropdownItem(label)
  }

  #configCollaborationSettings(collaboration) {
    const { connect, discussion } = collaboration
    if (connect) {
      if (connect.enable) this.#turnOnEnableConnect()
      else this.#turnOffEnableConnect()
      if (connect.whoLearnersCanSee) this.#selectWhoLearnerCanSee(connect.whoLearnersCanSee)
    }
    if (discussion) {
      if (discussion.enable) this.#turnOnEnableDiscussion()
      else this.#turnOffEnableDiscussion()
    }
  }

  #configCourseCompletion(courseCompletion) {
    const { awardLearnersWithCertificate, allowAddingToProfile } = courseCompletion

    if (awardLearnersWithCertificate) this.#turnOnAwardLearnerCertificate()
    else this.#turnOffAwardLearnerCertificate()

    if (allowAddingToProfile) this.#turnOnAllowAddingToProfile()
    else this.#turnOffAllowAddingToProfile()
  }

  #fillCourse(course, isEdit) {
    const {
      name,
      image,
      courseOverview,
      uploadFile,
      uploadFiles,
      courseFee,
      categories,
      collaborationSettings,
      courseCompletion,
    } = course

    this.#fillCourseTitle(name)
    if (image) this.#uploadCourseImage(image, isEdit)
    cy.typeInEditor(courseOverview)
    if (uploadFile) cy.uploadFile(uploadFile, ModifyCourseItc.uploadTempFile)
    if (uploadFiles) this.#uploadFiles(uploadFiles.path)
    if (courseFee) this.#fillCourseFee(courseFee)
    if (categories) this.#accessCategories(categories)
    if (collaborationSettings) this.#configCollaborationSettings(collaborationSettings)
    if (courseCompletion) this.#configCourseCompletion(courseCompletion)
  }

  createNewCourse(course) {
    this.#fillCourse(course)
    this.#clickButtonSaveAsDraft()
  }

  editCourse(course) {
    this.#clearCourse()
    this.#fillCourse(course, true)
    this.#clickButtonSaveCourse()
  }

  #removeUploadFiles() {
    cy.getElementWithLabel(ModifyCourseConstant.UPLOAD_FILE, '.input-text-wrapper').within(
      (file) => {
        if (super.foundUploadFile(file))
          super.getIconTrash().each(() => super.getIconTrash().first().click())
      }
    )
  }

  #removeCategories() {
    cy.getElementWithLabel(ModifyCourseConstant.CATEGORIES, '.item-selection').within(
      (category) => {
        if (super.foundCategory(category))
          super.getIconX().each(() => super.getIconX().first().click())
      }
    )
  }

  #clearCourse() {
    this.#removeUploadFiles()
    this.#removeCategories()
    cy.clearTextEditor()
  }

  resetCourse(newCourseName, previousCourse) {
    super
      .getInputCourseTitle()
      .invoke('val')
      .then((name) => {
        if (name == newCourseName) {
          this.editCourse(previousCourse)
        }
      })
  }

  resetEnableDiscussion() {
    super.isToggleOnEnableDiscussion().then(($enable) => {
      if (!$enable) {
        super.getToggleEnableDiscussion().toggleSwitch()
        this.#clickButtonSaveCourse()
      }
    })
  }

  enableDiscussion() {
    this.#turnOnEnableDiscussion()
    this.#clickButtonSaveCourse()
  }

  disableDiscussion() {
    this.#turnOffEnableDiscussion()
    this.#clickButtonSaveCourse()
  }

  resetEnableConnect() {
    super.isToggleOnEnableConnect().then(($enable) => {
      if (!$enable) {
        super.getToggleEnableConnect().toggleSwitch()
        this.#clickButtonSaveCourse()
      }
    })
  }

  enableConnect() {
    this.#turnOnEnableConnect()
    this.#clickButtonSaveCourse()
  }

  disableConnect() {
    this.#turnOffEnableConnect()
    this.#clickButtonSaveCourse()
  }
}
