import SignInAs from '../../../../../utilities/SignInAs'
import ModifyCourseQueries from '../../queries/ModifyCourseQueries'

export default class ModifyCourseLogin extends ModifyCourseQueries {
  asLearningAdminEmery(courseId) {
    SignInAs.learningAdminEmery(super.getUrlEditCourseOrgLms(courseId))
  }
}
