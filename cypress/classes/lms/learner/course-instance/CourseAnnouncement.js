import CourseDetail from '../../CourseDetail'
class CourseAnnouncement {
  #courseDetail = new CourseDetail()

  /* Query */
  #getCourseDetail() {
    return cy.get('#_courseDetailPortlet_courseDetail')
  }
  #getCourseAnnouncement() {
    return cy.get('.bg-white.border')
  }

  /* Assertion */
  _verifyCourseAnnouncementNotExist() {
    this.#getCourseDetail().within(() => {
      this.#getCourseAnnouncement().should('not.exist')
    })
  }

  _verifyCourseAnnouncementIsVisible(course, announcement, deliveryMethod) {
    this.#getCourseDetail().within(() => {
      this.#getCourseAnnouncement()
        .should('be.visible')
        .invoke('text')
        .then(($text) => {
          expect($text.trim()).to.equal(announcement)
        })
      cy.expectElementWithLabelVisible(deliveryMethod, '.property:contains("Delivery Methods:")')
      this.#courseDetail._verifyMainHeaderIsVisible(course.name)
    })
  }
}

export default CourseAnnouncement
