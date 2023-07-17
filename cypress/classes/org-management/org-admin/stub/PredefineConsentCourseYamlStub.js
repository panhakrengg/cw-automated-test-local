import Faker from '../../../utilities/Faker'
import YamlHelper from '../../../utilities/YamlHelper'

class PredefineConsentCourseYamlStub {
  #consentBaseYaml
  #courseBaseYaml
  #instanceBaseYaml
  #faker = new Faker()

  setData() {
    new YamlHelper('consent').read().then(({ ConsentSuite }) => {
      this.#courseBaseYaml = ConsentSuite.courses.predefineConsent
      this.#consentBaseYaml = this.#courseBaseYaml.manageConsent.predefine
      this.#instanceBaseYaml = this.#courseBaseYaml.blendedInstance
    })
  }

  getConsentBaseYaml() {
    return this.#consentBaseYaml
  }

  getCourseName() {
    return this.#courseBaseYaml.name
  }

  getCourseId() {
    this.#faker.setPathFixture(this.#courseBaseYaml)
    return this.#faker.getUrlId()
  }

  getInstanceId() {
    this.#faker.setPathFixture(this.#instanceBaseYaml)
    return this.#faker.getUrlId()
  }

  getInstanceName() {
    return this.#instanceBaseYaml.name
  }
}

export default PredefineConsentCourseYamlStub
