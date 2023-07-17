import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'
import SignInAs from '../../../../utilities/SignInAs'
import ManageCourseInstanceItc from '../intercepts/ManageCourseInstanceItc'
import ManageCourseInstanceQueries from '../queries/ManageCourseInstanceQueries'

class CourseInstanceLogin {
  #manageCourseInstanceQueries = new ManageCourseInstanceQueries()

  toManageCourseInstanceAsCourseAdminTressie(courseId) {
    ManageCourseInstanceItc.itcFetchCourseInstances.set()
    SignInAs.courseAdminTressie(
      OrgConst.FIRE_CLOUD_FULL_CATALOG_URL +
        this.#manageCourseInstanceQueries.getManageCourseInstanceUrl(courseId)
    )
    ManageCourseInstanceItc.itcFetchCourseInstances.wait()
  }
}

export default CourseInstanceLogin
