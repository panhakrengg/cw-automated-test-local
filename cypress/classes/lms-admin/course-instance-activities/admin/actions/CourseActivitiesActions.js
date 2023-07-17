import Field from '../../../../constants/Field'
import { Lms } from '../../../../constants/Lms'
import { CourseActivityTypes } from '../../../base/constant/CourseActivityTypes'
import ActivityLibraryItc from '../../../base/intercepts/ActivityLibraryItc'
import CourseActivitiesItc from '../intercepts/CourseActivitiesItc'
import CourseActivitiesQueries from '../queries/CourseActivitiesQueries'
import CourseActivitiesYamlStub from '../stub/CourseActivitiesYamlStub'

class CourseActivitiesActions extends CourseActivitiesQueries {
  visitCourseInstanceActivities(course, courseInstance) {
    const courseActivitiesYamlStub = new CourseActivitiesYamlStub()
    const courseId = courseActivitiesYamlStub.getUrlId(course)
    const instanceId = courseActivitiesYamlStub.getUrlId(courseInstance)
    CourseActivitiesItc.itcFetchCourseActivitiesSequential.set()
    cy.visit(super.getCourseInstanceActivitiesUrl(courseId, instanceId))
    CourseActivitiesItc.itcFetchCourseActivitiesSequential.wait()
    cy.waitLoadingOverlayNotExist()
  }

  clickAddLearningActivityButton() {
    cy.wait(10000)
    super.getAddLearningActivityButton().click()
  }

  #selectActivityTypeInCreateActivityPopup(type) {
    super.getActivityTypeInCreateActivityPopupByType(type).click()
  }

  #clickChooseFromActivityLibraryLink() {
    super.getChooseFromActivityLibraryLink().click()
  }

  #filterActivityLibrary(from) {
    CourseActivitiesItc.itcSearchActivityLibrary.set()
    cy.clickCwDropdownItem(from)
    CourseActivitiesItc.itcSearchActivityLibrary.wait()
  }

  #searchActivityLibrary(instanceTitle) {
    CourseActivitiesItc.itcSearchActivityLibrary.set()
    cy.inputSearch().clear().type(`"${instanceTitle}" {enter}`)
    CourseActivitiesItc.itcSearchActivityLibrary.wait()
  }

  #chooseActivityFromActivityLibraryPopup(instanceTitle, from) {
    cy.getPopup().within(() => {
      this.#filterActivityLibrary(from)
      this.#searchActivityLibrary(instanceTitle)
      cy.getElementWithLabel(instanceTitle, 'a').last().click()
      cy.clickPrimaryButton(Field.ADD)
    })
  }

  clickSaveUpdatedActivity() {
    CourseActivitiesItc.itcModifyCourseActivity.set()
    cy.clickPrimaryButton(Field.SAVE)
    CourseActivitiesItc.itcModifyCourseActivity.wait()
  }

  addNewELearningCourseActivity() {
    this.clickAddLearningActivityButton()
    this.#selectActivityTypeInCreateActivityPopup(CourseActivityTypes.INTERACTIVE_ELEARNING)
  }

  addNewQuizCourseActivity() {
    this.clickAddLearningActivityButton()
    this.#selectActivityTypeInCreateActivityPopup(CourseActivityTypes.QUIZ)
  }

  addNewFileCourseActivity() {
    this.clickAddLearningActivityButton()
    this.#selectActivityTypeInCreateActivityPopup(CourseActivityTypes.FILE)
  }

  addNewHyperlinkCourseActivity() {
    this.clickAddLearningActivityButton()
    this.#selectActivityTypeInCreateActivityPopup(CourseActivityTypes.HYPERLINK)
  }

  addCourseActivityFromActivityLibrary(activityTitle, from = Lms.publicLibrary) {
    super.getTheLastCourseActivity().then(() => {
      this.#clickChooseFromActivityLibraryLink()
      this.#chooseActivityFromActivityLibraryPopup(activityTitle, from)
    })
  }

  expandActivityAccordionByTitle(activityTitle) {
    super.getActivityByTitle(activityTitle).first().click()
  }

  clickActivityThreeDotItem(activityTitle, threeDotItem) {
    super
      .getActivityByTitle(activityTitle)
      .last()
      .within(($activity) => {
        cy.wrap($activity).clickDropdownItem(threeDotItem)
      })
  }

  clickThreeDotDeleteActivity(activityTitle) {
    this.clickActivityThreeDotItem(activityTitle, Field.DELETE)
  }

  clickThreeDotEditActivity(activityTitle) {
    this.clickActivityThreeDotItem(activityTitle, Field.EDIT)
  }

  deleteCourseActivity(activityTitle) {
    CourseActivitiesItc.itcDeleteCourseActivity.set()
    super.getTotalActivitiesByTitle(activityTitle).then(($total) => {
      if ($total) {
        for (let i = 0; i < $total; i++) {
          this.clickThreeDotDeleteActivity(activityTitle)
          cy.clickConfirmPopUp(Field.YES_DELETE)
          CourseActivitiesItc.itcDeleteCourseActivity.wait()
          cy.waitLoadingOverlayNotExist()
        }
      }
    })
  }

  clickEditDetails() {
    super.getEditDetailsLink().click()
  }

  inputActivityTitle(title) {
    super.getInputActivityTitle().wait(1000).clear().type(title)
  }

  inputActivityDescription(description) {
    cy.clearTextEditor()
    cy.typeInEditor(description)
  }

  addActivityToLibrary(title) {
    super.getActivityByTitle(title).within(($activity) => {
      cy.wrap($activity).clickDropdownItem(Lms.addToActivityLibrary)
    })
    ActivityLibraryItc.itcCreateTempFolder.set()
    cy.clickConfirmPopUp(Field.YES_ADD)
    ActivityLibraryItc.itcCreateTempFolder.wait()
  }

  updateCourseActivityTemplate(title, updateTitle, updateDesc) {
    this.clickThreeDotEditActivity(title)
    this.clickEditDetails()
    this.inputActivityTitle(updateTitle)
    if (updateDesc) this.inputActivityDescription(updateDesc)
    this.clickSaveUpdatedActivity()
  }

  updateCourseActivityTemplateIfExist(title, titleUpdate, description) {
    super.getTotalActivitiesByTitle(title).then(($total) => {
      if ($total) {
        this.updateCourseActivityTemplate(title, titleUpdate, description)
      }
    })
  }
}

export default CourseActivitiesActions
