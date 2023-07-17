import CourseDetailsQueries from '../queries/CourseDetailsQueries'

class CourseDetailsAssertions extends CourseDetailsQueries {
  expectToSeeCourseInstanceDetails(instanceObj) {
    const instanceTitle = instanceObj.title.value
    super.getCourseInstanceByInstanceTitle(instanceTitle).within(() => {
      if (instanceTitle) cy.expectElementWithLabelVisible(instanceTitle, 'span')
      if (instanceObj.deliveryMethod)
        cy.expectElementWithLabelVisible(`(${instanceObj.deliveryMethod})`, 'span')
      if (instanceObj.maxParticipant)
        cy.expectElementWithLabelVisible(`(${instanceObj.maxParticipant} slots available)`, 'span')
      if (instanceObj.language)
        cy.expectElementWithLabelVisible(instanceObj.language.join(', '), 'span')
    })
  }
}

export default CourseDetailsAssertions
