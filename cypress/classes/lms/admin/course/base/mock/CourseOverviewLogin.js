import SignInAs from '../../../../../utilities/SignInAs'
import CourseOverviewQueries from '../../queries/CourseOverviewQueries'

class CourseOverviewLogin extends CourseOverviewQueries {
  asCourseAdminGiles(courseId) {
    SignInAs.courseAdminGiles(super.getUrlOrgLms(courseId))
  }
}

export default CourseOverviewLogin
