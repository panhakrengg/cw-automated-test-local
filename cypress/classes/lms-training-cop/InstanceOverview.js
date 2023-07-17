import Field from '../constants/Field'

class InstanceOverview {
  #course
  #instance

  setCourseAndInstance(course, instance) {
    this.#course = course
    this.#instance = instance
  }
  #expectToSeeLanguages($wrapper) {
    let languages = this.#instance.displayLanguages
    if (languages) {
      languages = languages.split(',')
      const text = languages.length > 1 ? 'Languages: ' : 'Language: '
      cy.wrap($wrapper).get(`span:contains('${text}') > span`).should('contain.text', languages)
    }
  }
  verifyNewInstanceOverview(isEmpty = true) {
    const instanceFee = this.#instance.courseFee
    cy.wait(1000)
    cy.get('.course-detail-wrapper').within(($courseDetail) => {
      cy.wrap($courseDetail)
        .get('span:contains("Duration:") > span')
        .should('contain.text', this.#instance.duration)
      cy.wrap($courseDetail)
        .get('span:contains("Delivery Methods:") > span')
        .should('contain.text', this.#instance.deliveryMethod)
      this.#expectToSeeLanguages($courseDetail)
      cy.wrap($courseDetail)
        .get('strong:contains("Course Fee :")')
        .next()
        .should('contain.text', instanceFee ? instanceFee.value : this.#course.courseFee.value)
      cy.wrap($courseDetail)
        .get(`h1:contains("${Field.DESCRIPTION}")`)
        .next()
        .should('contain.text', this.#course.courseOverview)
      cy.wrap($courseDetail)
        .get(`h2:contains("${Field.ATTACHMENT}")`)
        .next()
        .within(($attachment) => {
          Object.entries(this.#course.uploadedFiles).forEach((file) => {
            cy.wrap($attachment).should('contain.text', file[1])
          })
        })
      cy.wrap($courseDetail)
        .get('span:contains("Tags & Skills covered in this course:")')
        .next()
        .within(($tagSkills) => {
          Object.entries(this.#course.tagSkill).forEach((tagSkill) => {
            cy.wrap($tagSkills).should('contain.text', tagSkill[1])
          })
        })
      if (isEmpty) {
        cy.wrap($courseDetail).get('button:contains("Go to course activity")').should('be.visible')
      }
    })
  }
  verifyInstanceOveview() {
    this.verifyNewInstanceOverview(false)
  }
}

export default InstanceOverview
