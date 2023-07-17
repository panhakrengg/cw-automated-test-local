class ModifyCourseInstanceQueries {
  getCourseInstanceTitleInput() {
    return cy.getElementWithLabel('Instance Title', 'label').next()
  }
  getTheFirstSelectBadgeLanguage() {
    return cy.get('.dropdown-toggle .badge > span')
  }
  getCourseCompletion() {
    return cy.getElementWithLabel('Course Completion (days)', 'label').next()
  }
  getExpectedDuration() {
    return cy.getElementWithLabel('Expected Duration (minutes)', 'label').next()
  }
  getTimeZoneSelect() {
    return cy.getElementWithLabel('Time Zone', 'label').next()
  }
  getStartDateInput() {
    return cy.getElementWithLabel('Start Date', 'label').next().find('input[name="date"]')
  }
  getEndDateInput() {
    return cy.getElementWithLabel('End Date', 'label').next().find('input[name="date"]')
  }
  getMaxParticipantsInput() {
    return cy.getElementWithLabel('Maximum Number of Participants', 'label').next()
  }
  getMustBookByInput() {
    return cy.getElementWithLabel('Must Book by', 'label').next()
  }
  getMustCancelByInput() {
    return cy.getElementWithLabel('Must Cancel by', 'label').next()
  }
  getContactEmailInput() {
    return cy.getElementWithLabel('Course Contact Email', 'label').next()
  }
  getBookNoteTextarea() {
    return cy.getElementWithLabel('Additional Booking Note', 'label').next()
  }
  getCourseFee() {
    return cy.getElementWithLabel('Course Fee', 'label').next().find('input')
  }
}

export default ModifyCourseInstanceQueries
