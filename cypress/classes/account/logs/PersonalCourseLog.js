import { PersonalType } from '../../constants/my-account/MyActivity'

class PersonalCourseLog {
  userName = ''
  consentName = ''
  courseName = ''

  setData(learner, consentFormName, courseName) {
    this.userName = learner
    this.consentName = consentFormName
    this.courseName = courseName
  }
  textLogGaveCourseConsent() {
    return `${this.userName} ${PersonalType.GAVE_CONSENT_FOR} ${this.consentName}`
  }
  textLogRevokeCourseConsent() {
    return `${this.userName} ${PersonalType.REVOKED_CONSENT_FOR} ${this.consentName}`
  }
  textLogDisabledCourseConsent() {
    return `${this.userName} ${PersonalType.DISABLED_CONSENT_FOR} ${this.courseName}.`
  }
  textLogEnabledCourseConsent() {
    return `${this.userName} ${PersonalType.ENABLED_CONSENT_FOR} ${this.courseName}.`
  }
  textLogUsedPredefinedCourseConsentForm() {
    return `${this.userName} ${PersonalType.USED_PREDEFINED_CONSENT_FORM} ${this.consentName}`
  }
}

export default PersonalCourseLog
