class CourseDetailsQueries {
  getCourseDetailsUrl(courseId) {
    return `/u/home/course-detail?p_p_id=courseDetailPortlet&p_p_lifecycle=0&_courseDetailPortlet_id=${courseId}&_courseDetailPortlet_type=2&_courseDetailPortlet_isMyLearning=false&_courseDetailPortlet_mvcRenderCommandName=%2Fcourse%2Fdetail`
  }

  getCourseInstanceByInstanceTitle(title) {
    cy.cecCard()
      .cardRightContent()
      .within(() => {
        cy.getElementWithLabel(title, 'span').parents('.radio-container').first().as('instance')
      })
    return cy.get('@instance')
  }
}

export default CourseDetailsQueries
