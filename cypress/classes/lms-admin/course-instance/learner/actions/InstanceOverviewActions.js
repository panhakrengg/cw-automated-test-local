import InstanceOverviewItc from '../intercepts/InstanceOverviewItc'
import InstanceOverviewQueries from '../queries/InstanceOverviewQueries'

class InstanceOverviewActions extends InstanceOverviewQueries {
  visitCourseInstanceOverview(courseInstanceId) {
    InstanceOverviewItc.activitiesCourseCatalog.set()
    cy.visit(super.getCourseInstanceOverviewUrl(courseInstanceId))
    InstanceOverviewItc.activitiesCourseCatalog.wait()
  }
}

export default InstanceOverviewActions
