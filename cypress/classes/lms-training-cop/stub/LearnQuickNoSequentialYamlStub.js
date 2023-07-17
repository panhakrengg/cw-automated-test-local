import EntryYamlManagement from '../../utilities/EntryYamlManagement'

class LearnQuickNoSequentialYamlStub {
  #getDataEntryYaml(dataCallback) {
    const pathUnderFixture = 'lms-training-cop/course-instances/learn-quick-no-sequential'
    EntryYamlManagement._readData(pathUnderFixture, dataCallback)
  }

  getData(dataCallback) {
    this.#getDataEntryYaml(dataCallback)
  }
}

export default LearnQuickNoSequentialYamlStub
