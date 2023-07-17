import SignInAs from '../../../../../../classes/utilities/SignInAs'
import TrainingReportsQueries from '../../queries/TrainingReportsQueries'

export default class TrainingReportsLogin extends TrainingReportsQueries {
  toTopLevelAsLearningAdmin() {
    SignInAs.learningAdminEmery(super.getUrlOrgLms())
  }

  toTopLevelAsCategoryAdminKenton() {
    SignInAs.categoryAdminKenton(super.getUrlOrgLms())
  }

  toCourseLevelAsCourseAdminTressie(courseId) {
    SignInAs.courseAdminTressie(super.getUrlCourseLevelOrgLms(courseId))
  }

  toInstanceLevelAsCourseAdminTressie(courseId, instanceId) {
    SignInAs.courseAdminTressie(super.getUrlInstanceLevelOrgLms(courseId, instanceId))
  }
}
