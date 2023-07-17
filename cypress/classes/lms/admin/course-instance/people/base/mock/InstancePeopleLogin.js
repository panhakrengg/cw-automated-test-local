import SignInAs from '../../../../../../utilities/SignInAs'
import InstancePeopleQueries from '../../queries/InstancePeopleQueries'

export default class InstancePeopleLogin extends InstancePeopleQueries {
  toOrgLmsAsLearningAdmin(courseId, instanceId) {
    SignInAs.learningAdminEmery(super.getUrlOrgLms(courseId, instanceId))
  }

  toOrgLmsAsCategoryAdminKenton(courseId, instanceId) {
    SignInAs.categoryAdminKenton(super.getUrlOrgLms(courseId, instanceId))
  }
  toCopAsCopOwnerKristy(copAdminUrl, courseId, instanceId) {
    SignInAs.copOwner_Kristy(super.getUrlCop(copAdminUrl, courseId, instanceId))
  }
}
