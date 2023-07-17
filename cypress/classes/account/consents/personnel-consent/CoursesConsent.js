import ConsentSettings from '../ConsentSettings'
import ConsentConstant from './ConsentConstant'

class CoursesConsent extends ConsentSettings {
  #courseYamlData

  constructor(courseYamlData) {
    super(courseYamlData)
    this.#courseYamlData = courseYamlData
  }

  verifyCourseConsentItem() {
    super.accessConsentTab(ConsentConstant.consentTabs[1].name)
    super.verifyConsentItemElement(
      this.#courseYamlData.consent.name,
      ConsentConstant.courseDetailLabels,
      ConsentConstant.options
    )
  }
}

export default CoursesConsent
