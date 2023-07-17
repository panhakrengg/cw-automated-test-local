class LmsManagementHelper {
  static expectToSeeEntryLabel(label) {
    cy.contains('span.status', label).should('be.visible')
  }

  static expectToSeeCourseLabel() {
    this.expectToSeeEntryLabel('Course')
  }

  static expectToSeeLearningPathLabel() {
    this.expectToSeeEntryLabel('Learning Path')
  }

  static expectToSeeCoursesForThisLearningPathLabel() {
    cy.expectElementWithLabelVisible('Courses for this Learning Path', 'h1')
  }

  static #expectToSeeProgressLabel(label) {
    cy.expectElementWithLabelVisible(label, '.overall-title b')
  }

  static #expectToSeeCompletedLabel(label, clazz = '.learning-progress h5') {
    cy.expectElementWithLabelVisible(label, clazz)
  }

  static #expectToSeeCourseProgressBar() {
    cy.get('.progress').and('be.visible')
  }

  static expectToSeeCourseProgressBarStatus(value = 0) {
    if (value != '0') {
      cy.get('.progress-bar')
        .should('be.visible')
        .eq(0)
        .invoke('attr', 'aria-valuenow')
        .should('eq', value)
    } else {
      cy.get('.progress-bar').should('not.be.visible')
    }
  }

  static _expectToSeeProgressBaseSection(entry) {
    this.#expectToSeeCompletedLabel(entry.complete.label, entry.complete.cssClazz)
    this.#expectToSeeCourseProgressBar()
    if (entry.progressBarPercentage) {
      this.expectToSeeCourseProgressBarStatus(entry.progressBarPercentage)
    }
  }

  static _expectToSeeProgressMainSection(entry) {
    this._expectToSeeProgressBaseSection(entry)
    this.#expectToSeeProgressLabel(entry.progressLabel)
  }
}
export default LmsManagementHelper
