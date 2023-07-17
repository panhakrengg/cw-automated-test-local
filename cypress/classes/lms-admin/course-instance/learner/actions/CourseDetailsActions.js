import CourseDetailsItc from '../intercepts/CourseDetailsItc'
import CourseDetailsQueries from '../queries/CourseDetailsQueries'

class CourseDetailsActions extends CourseDetailsQueries {
  visitCourseDetails(courseId) {
    CourseDetailsItc.itcFetchTermAndCondition.set()
    cy.visit(super.getCourseDetailsUrl(courseId))
    CourseDetailsItc.itcFetchTermAndCondition.wait()
  }
}

export default CourseDetailsActions
