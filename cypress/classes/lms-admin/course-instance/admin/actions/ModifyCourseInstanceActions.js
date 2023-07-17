import Environment from '../../../../base/Environment'
import Field from '../../../../constants/Field'
import { CreateInstanceConstant } from '../constant/CreateInstanceConstant'
import CourseInstanceOverviewItc from '../intercepts/CourseInstanceOverviewItc'
import ModifyCourseInstanceItc from '../intercepts/ModifyCourseInstanceItc'
import ModifyCourseInstanceQueries from '../queries/ModifyCourseInstanceQueries'

class ModifyCourseInstanceActions extends ModifyCourseInstanceQueries {
  env = new Environment()

  #clickAddFacilitatorButton() {
    cy.clickLinkByName(CreateInstanceConstant.ADD_FACILITATOR)
  }

  #searchThenAddFacilitator(users) {
    ModifyCourseInstanceItc.itcFetchUsersInstance.set()
    cy.getPopup().within(() => {
      users.forEach((faci) => {
        cy.inputByPlaceholder('Search', faci)
        ModifyCourseInstanceItc.itcFetchUsersInstance.wait()
        cy.getCheckbox().first().check()
      })
      cy.clickButtonByName(Field.ADD)
    })
  }

  #chooseDeliveryMethod(deliveryMethod) {
    if (deliveryMethod) cy.getElementWithLabel(deliveryMethod, '.delivery-method').click()
  }

  #inputInstanceTitle(title) {
    if (title) cy.inputByLabel(CreateInstanceConstant.INSTANCE_TITLE, title)
  }

  #addFacilitator(users) {
    if (users && this.env.isUat()) {
      this.#clickAddFacilitatorButton()
      this.#searchThenAddFacilitator(users.faci)
    }
  }

  #addLanguages(languages) {
    if (languages) {
      cy.clearCwMultiSelect()
      cy.selectCwMultiSelectItems(languages)
    }
  }

  #inputCourseCompletion(courseCompletion) {
    if (courseCompletion)
      cy.inputByLabel(CreateInstanceConstant.COURSE_COMPLETION, courseCompletion)
  }

  #inputExpectedDuration(expectedDuration) {
    if (expectedDuration)
      cy.inputByLabel(CreateInstanceConstant.EXPECTED_DURATION, expectedDuration)
  }

  #inputStartDate(startDate) {
    if (startDate) cy.inputByLabel(CreateInstanceConstant.START_DATE, startDate)
  }

  #inputEndDate(endDate) {
    if (endDate) cy.inputByLabel(CreateInstanceConstant.END_DATE, endDate)
  }

  #inputContactEmail(email) {
    if (email) cy.inputByLabel(CreateInstanceConstant.COURSE_CONTACT_EMAIL, email)
  }

  #inputAdditionalBookingNote(note) {
    if (note) cy.inputByLabel(CreateInstanceConstant.ADDITIONAL_NOTE, note)
  }

  #inputCourseFee(courseFee) {
    if (courseFee) cy.inputByLabel(CreateInstanceConstant.COURSE_FEE, courseFee.value)
  }

  #inputMaxParticipant(maxParticipant) {
    if (maxParticipant) cy.inputByLabel(CreateInstanceConstant.MAX_PARTICIPANTS, maxParticipant)
  }

  #inputMustBookBy(mustBookBy) {
    if (mustBookBy) cy.inputByLabel(CreateInstanceConstant.MUST_BOOK_BY, mustBookBy)
  }

  #inputMustCancelBy(mustCancelBy) {
    if (mustCancelBy) cy.inputByLabel(CreateInstanceConstant.MUST_CANCEL_BY, mustCancelBy)
  }

  fillInCreateInstanceForm(instanceObj) {
    this.#chooseDeliveryMethod(instanceObj.deliveryMethod)
    this.#inputInstanceTitle(instanceObj.title.value)
    this.#addLanguages(instanceObj.language)
    this.#inputCourseCompletion(instanceObj.courseCompletion)
    this.#inputExpectedDuration(instanceObj.expectedDuration)
    this.#inputStartDate(instanceObj.startDate)
    this.#inputEndDate(instanceObj.endDate)
    this.#inputContactEmail(instanceObj.courseContactEmail)
    this.#inputAdditionalBookingNote(instanceObj.additionalBookingNote)
    this.#inputCourseFee(instanceObj.courseFee)
    this.#inputMaxParticipant(instanceObj.maxParticipant)
    this.#inputMustBookBy(instanceObj.mustBookBy)
    this.#inputMustCancelBy(instanceObj.mustCancelBy)
  }

  clickSaveInstanceButton() {
    ModifyCourseInstanceItc.itcUpdateInstance.set()
    cy.clickButtonByName(CreateInstanceConstant.SAVE_INSTANCE)
    ModifyCourseInstanceItc.itcUpdateInstance.wait()
    cy.waitLoadingOverlayNotExist()
  }

  #modifyCourseInstance(instanceObj) {
    this.fillInCreateInstanceForm(instanceObj)
    this.clickSaveInstanceButton()
  }

  createCourseInstance(instanceObj) {
    CourseInstanceOverviewItc.itcFetchCourseActivities.set()
    this.#modifyCourseInstance(instanceObj)
    CourseInstanceOverviewItc.itcFetchCourseActivities.wait()
  }

  editCourseInstance(instanceObj) {
    CourseInstanceOverviewItc.itcModifyCourseInstance.set()
    this.#modifyCourseInstance(instanceObj)
    CourseInstanceOverviewItc.itcModifyCourseInstance.wait()
  }
}

export default ModifyCourseInstanceActions
