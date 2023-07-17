import Field from '../../../../constants/Field'
import CourseInstanceOverviewItc from '../intercepts/CourseInstanceOverviewItc'
import CourseInstanceOverviewQueries from '../queries/CourseInstanceOverviewQueries'

class CourseInstanceOverviewActions extends CourseInstanceOverviewQueries {
  visitCourseInstanceOverviewByInstanceId(courseId, instanceId) {
    cy.visit(super.getCourseInstanceOverviewUrl(courseId, instanceId))
  }

  #publishInstanceWithConfirm() {
    CourseInstanceOverviewItc.itcCourseInstancePublish.set()
    super.getPublishToggle().check({ force: true })
    cy.swal2Confirm(Field.PUBLISH).click()
    CourseInstanceOverviewItc.itcCourseInstancePublish.wait()
  }

  #publishInstanceWithoutConfirm() {
    CourseInstanceOverviewItc.itcCourseInstancePublish.set()
    super.getPublishToggle().check({ force: true })
    CourseInstanceOverviewItc.itcCourseInstancePublish.wait()
  }

  publishCourseInstanceWithoutActivity() {
    super.getPublishState().then(($state) => {
      if (!$state) {
        this.#publishInstanceWithConfirm()
      }
    })
  }
}

export default CourseInstanceOverviewActions
