import EntryYamlManagement from '../../utilities/EntryYamlManagement'
import Faker from '../../utilities/Faker'

class HelpGuidesYamlStub {
  #articlesPlatForm = 'HelpGuide.admin.articles.platForm'
  faker = new Faker()
  topics = {
    userSettings: this.faker.getAuTextNotDelete('User Settings'),
    security: this.faker.getAuTextNotDelete('Security'),
    automate: this.faker.getAuTextNotDelete('Automate'),
  }
  roles = {
    general: this.faker.getAuTextNotDelete('General'),
    trainers: this.faker.getAuTextNotDelete('Trainers'),
  }

  #getDataEntryYaml(baseYamlPath, dataEntryCallback) {
    const pathUnderFixture = 'help-guide'
    EntryYamlManagement._readDataEntry(pathUnderFixture, baseYamlPath, dataEntryCallback)
  }

  getExistingArticlesInPlatForm(dataEntryCallback) {
    this.#getDataEntryYaml(this.#articlesPlatForm, dataEntryCallback)
  }
}

export default HelpGuidesYamlStub
