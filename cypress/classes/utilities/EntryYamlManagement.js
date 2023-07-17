import Faker from './Faker'
import YamlHelper from './YamlHelper'

class EntryYamlManagement {
  static _readDataEntry(pathUnderFixture, entryPoint, dataEntryCallback = () => {}) {
    new YamlHelper(pathUnderFixture)
      .read()
      .its(entryPoint)
      .then((entry) => {
        return dataEntryCallback(entry)
      })
  }

  static _readData(pathUnderFixture, dataEntryCallback = () => {}) {
    new YamlHelper(pathUnderFixture).read().then((entry) => {
      return dataEntryCallback(entry)
    })
  }

  //entryPoint -> course/courseInstance
  static _getUrlId(entryPoint) {
    const faker = new Faker()
    faker.setPathFixture(entryPoint)
    return faker.getUrlId()
  }
}

export default EntryYamlManagement
