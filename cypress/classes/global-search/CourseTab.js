import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'

class CourseTab {
  #courseName

  #itcFetchCourseInstance = new InterceptReq(
    '/course_catalog/course_instances/fetch',
    'FetchCourseInstance'
  )

  setCourseName(name) {
    this.#courseName = name
  }

  defineAliasCourseCard() {
    cy.getElementWithLabel(this.#courseName, 'h3')
      .parents('.search-result__wrapper')
      .as('courseCard')
  }

  clickView(index = 0) {
    this.defineAliasCourseCard()
    this.#itcFetchCourseInstance.set()
    cy.get('@courseCard')
      .eq(index)
      .within(() => {
        cy.clickLinkByName(Field.VIEW)
      })
    this.#itcFetchCourseInstance.wait()
  }
}
export default CourseTab
