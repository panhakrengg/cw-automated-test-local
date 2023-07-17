import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'

class LearningPathCourses {
  #itcFetchCourseLearningPath = new InterceptReq(
    '/learning_path/courses/fetch',
    'FetchCourseLearningPath'
  )

  clickAddCourseButton() {
    cy.clickButtonByName('Add Course')
  }

  clickAddButton() {
    cy.getPopup().within(() => {
      cy.clickButtonByName(Field.ADD)
    })
  }

  #searchCourse(courseName) {
    this.#itcFetchCourseLearningPath.set()
    cy.inputByPlaceholder('Search Course', `"${courseName}"`)
    this.#itcFetchCourseLearningPath.wait()
  }
  searchThenAdd(courseName) {
    this.#searchCourse(courseName)
    cy.getPopup().within(() => {
      cy.getCheckboxList().getCheckbox().first().click()
    })
  }
  searchThenExpectToSeeCourse(courseName) {
    cy.getPopup().within(() => {
      this.#searchCourse(courseName)
      cy.expectElementWithLabelVisible(courseName, 'h4')
    })
  }
  searchThenExpectCannotSeeCourse(courseName) {
    cy.getPopup().within(() => {
      this.#searchCourse(courseName)
      cy.expectElementWithLabelVisible('No result found.', 'span')
      cy.expectElementWithLabelNotExist(courseName, 'h4')
    })
  }
  expectToSeeCourse(courseName) {
    cy.expectElementWithLabelVisible(courseName, 'a')
  }
  expectNotToSeeCourse(courseName) {
    cy.expectElementWithLabelNotExist(courseName, 'a')
  }
  expectToSeeSaveCourseButton() {
    cy.expectButtonWithLabelAndEnabled(Field.SAVE)
  }
  expectToSeeWarningPrompt() {
    cy.verifySwal2Confirmation(
      'Are you sure you want to leave?',
      'Note: Unsaved changes may be lost.',
      Field.YES,
      Field.CANCEL
    )
  }
}
export default LearningPathCourses
