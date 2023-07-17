import ManageConsent from '../ManageConsent'
import ManageCourseConsent from '../ManageCourseConsent'

class ManageConsentHelper {

  #manageConsent = new ManageConsent()
  #manageCourseConsent = new ManageCourseConsent()

  #createDefaultConsentForm(newConsentForm) {
    this.#manageConsent.createDefaultConsentForm(newConsentForm)
    this.#manageConsent.save()
  }

  replaceCourseConsentForm(courseId = 0, preDefinedConsentForm = {}, newConsentForm = {}) {
    this.#manageCourseConsent.accessToManageConsentBy(courseId)
    this.#manageCourseConsent.enableConsentForm().then(($enableConsent) => {
      if ($enableConsent) {
        this.#manageCourseConsent.replaceConsent()
        this.#manageCourseConsent.selectPredefinedConsentForm(preDefinedConsentForm)
      } else {
        this.#manageCourseConsent.clickToEnableConsentForm()
        this.#createDefaultConsentForm(newConsentForm)
      }
    })
  }
}

export default ManageConsentHelper
