import InterceptReq from '../../../base/InterceptReq'
import { OrgConst } from '../../../org-management/base-org-management/OrgStub'
import SignInAs from '../../../utilities/SignInAs'

class SetupLearningPath {
  constructor() {
    this.login = new Login()
  }

  #addImage(path) {
    cy.clickButtonByName('Add a Course Image')
    cy.changeImage(path)
  }

  #fillDuration(duration) {
    const { months, days, hours, minutes } = duration
    cy.getElementWithLabel('Expected Duration', 'p')
      .parent()
      .within(() => {
        if (months) cy.get('input').eq(0).type(months)
        if (days) cy.get('input').eq(1).type(days)
        if (hours) cy.get('input').eq(2).type(hours)
        if (minutes) cy.get('input').eq(3).type(minutes)
      })
  }

  #selectCategories(categories) {
    cy.clickButtonByName('Select Categories')
    cy.getPopup().within(() => {
      categories.forEach((ctg) => {
        cy.getElementWithLabel(ctg, 'label').getCheckbox().check()
      })
      cy.clickButtonByName('Save')
      cy.wait(100)
    })
  }

  #selectPhaseSite(phases) {
    phases.forEach((phase) => {
      cy.clickDropdownSelect(phase)
    })
  }

  #clickSaveLearningPath() {
    Itc.modifyLearningPath.set()
    Itc.getDetailLearningPath.set()
    cy.clickButtonByName('Save learning path')
    Itc.modifyLearningPath.wait()
    Itc.getDetailLearningPath.wait()
  }

  #clickAddCourse() {
    Itc.fetchCoursesLearningPath.set()
    cy.clickButtonByName('Add Course')
    Itc.fetchCoursesLearningPath.wait()
  }

  #searchThenAddCourses(courses) {
    cy.getPopup().within(() => {
      courses.forEach((course) => {
        cy.inputByPlaceholder('Search Course', `"${course}"`)
        Itc.fetchCoursesLearningPath.wait()
        cy.waitIconLoadingNotExist()

        cy.getCheckbox().first().check()
      })
      cy.clickButtonByName('Add')
      cy.wait(100)
    })
  }

  #clickSaveCourse() {
    Itc.updateCourseLearningPath.set()
    cy.clickButtonByName('Save')
    Itc.updateCourseLearningPath.wait()
  }

  createLearningPath(lp) {
    const { name, image, overview, categories, phaseSite, duration } = lp

    cy.inputByPlaceholder('Enter the title of the learning path', name)
    if (image) this.#addImage(image.path)
    if (overview) cy.typeInEditor(overview)
    if (duration) this.#fillDuration(duration)
    if (categories) this.#selectCategories(categories)
    if (phaseSite) this.#selectPhaseSite(phaseSite)
    this.#clickSaveLearningPath()
  }

  addCoursesFromOverview(courses) {
    cy.cardRightContent()
      .find('nav')
      .within(() => cy.clickLinkByName('Courses'))
    this.#clickAddCourse()
    this.#searchThenAddCourses(courses)
    this.#clickSaveCourse()
  }
}

class Itc {
  static modifyLearningPath = new InterceptReq('/learning_path/modify', 'ModifyLearningPath')
  static getDetailLearningPath = new InterceptReq(
    '/learning_path/get_detail',
    'GetDetailLearningPath'
  )
  static fetchCoursesLearningPath = new InterceptReq(
    '/learning_path/courses/fetch',
    'FetchCoursesLearningPath'
  )
  static updateCourseLearningPath = new InterceptReq(
    '/learning_path/update_courses',
    'UpdateCourseLearningPath'
  )
}

class Login {
  #getUrl() {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/manage-learning-paths`
  }
  #getCreateLearningPathUrl() {
    return `${this.#getUrl()}?p_p_id=learningPathAdminPortlet&p_p_lifecycle=0&_learningPathAdminPortlet_mvcRenderCommandName=%2Flearning-path%2Fedit`
  }

  toCreateLearningPathAsLearningPathF() {
    SignInAs.learningPathF(this.#getCreateLearningPathUrl())
  }
  toLearningPathAsLearningAdmin() {
    SignInAs.learningAdminEmery(this.#getUrl())
  }
  toLearningPathAsLearningPathF() {
    SignInAs.learningPathF(this.#getUrl())
  }
}

export default SetupLearningPath
