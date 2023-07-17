import SignInAs from '../../../../../utilities/SignInAs'
import AdminCourseListQueries from '../../queries/AdminCourseListQueries'

export default class AdminCourseListLogin extends AdminCourseListQueries {
  asLearningAdminEmery() {
    SignInAs.learningAdminEmery(super.getUrlOrgLms())
  }

  asCategoryAdminKenton() {
    SignInAs.categoryAdminKenton(super.getUrlOrgLms())
  }

  asCopOwnerPhoebe(copUrl) {
    SignInAs.copOwner_Phoebe(super.getUrlCop(copUrl))
  }
}
