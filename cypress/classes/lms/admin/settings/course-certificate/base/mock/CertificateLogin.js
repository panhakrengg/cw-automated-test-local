import ReSignInLmsAs from '../../../../../../utilities/sign-in/ReSignInLmsAs'

export default class CertificateLogin {
  toCertificateSettingsAsLearningAdminEmery(url) {
    new ReSignInLmsAs().lnAdmin_Emery(url)
  }
  toCourseDetailAsInstanceMemberMallory(url) {
    new ReSignInLmsAs().istMember_Mallory(url)
  }
  toCourseOverviewAsCourseAdminTressie(url) {
    new ReSignInLmsAs().rCouAdmin_Tressie(url)
  }
}
