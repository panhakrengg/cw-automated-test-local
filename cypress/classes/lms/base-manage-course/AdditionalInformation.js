class AdditionalInformation { 

  constructor(courseInstance) {
    this.courseInstance = courseInstance
  }

  _expectToSeeAdditionInfo() {
    cy.get('.course-additional-info').within(() => {
      this.#expectToSeeAdditionalIcon()
      this.#expectToSeeAdditionalLabel()
      this.#expectToSeeAdditionalBookingNoteLabel()
      this.#expectToSeeAdditionalBookingNote()
    })
  }

  #getBookingNote() {
    return this.courseInstance.additionalBookingNote
  }

  #expectToSeeAdditionalIcon() {
    cy.get('.d-flex svg').hasSvgIcon()
  }

  #expectToSeeAdditionalLabel() {
    cy.expectElementWithLabelVisible('Additional information', '.d-flex h3')
  }

  #expectToSeeAdditionalBookingNoteLabel() {
    cy.expectElementWithLabelVisible('Additional Booking Notes', '.text-dark .card-list h3')
  }

  #expectToSeeAdditionalBookingNote() {
    cy.expectElementWithLabelVisible(this.#getBookingNote(), '.text-dark .card-list p')
  }
}
export default AdditionalInformation