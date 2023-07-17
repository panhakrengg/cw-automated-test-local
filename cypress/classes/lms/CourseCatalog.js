import InterceptReq from '../base/InterceptReq'

class CourseCatalog {
  #itcFetchCourseActivities = new InterceptReq(
    '/course_catalog/book_course/activities',
    'fetchCourseActivities'
  )

  visitCourseDetail(courseId) {
    this.#itcFetchCourseActivities.set()
    cy.visit(
      `/u/home/course-detail?p_p_id=courseDetailPortlet&p_p_lifecycle=0&_courseDetailPortlet_id=${courseId}&_courseDetailPortlet_type=2&_courseDetailPortlet_isMyLearning=false&_courseDetailPortlet_mvcRenderCommandName=%2Fcourse%2Fdetail`
    )
    cy.get('body').then(($body) => {
      if ($body.find('#_courseDetailPortlet_courseDetail').length) {
        this.#itcFetchCourseActivities.wait()
      }
    })
  }

  expectToSeeCourseDetailPage() {
    cy.get('#_courseDetailPortlet_courseDetail').should('be.visible')
  }
}

export default CourseCatalog
