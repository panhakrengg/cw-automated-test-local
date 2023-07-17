import EntryYamlManagement from '../../utilities/EntryYamlManagement'

class CreateLearningPathYaml {
  #learningPathStatic = 'LearningPathStatic'
  #quickTip = 'LearningPathStatic.quickTip'
  #createLearningPath = 'CreateLearningPath'
  #onlyTitleNoImage = 'CreateLearningPath.onlyTitleNoImage'
  #weekendClass = 'CreateLearningPath.weekendClass'
  #existingName = 'CreateLearningPath.existingName'
  #getDataEntryYaml(baseYamlPath, callback) {
    const pathUnderFixture = '/lms-training-cop/learning-paths/create-learning-path'
    EntryYamlManagement._readDataEntry(pathUnderFixture, baseYamlPath, callback)
  }

  getLearningPathStatic(callback) {
    this.#getDataEntryYaml(this.#learningPathStatic, callback)
  }

  getCreateLearningPath(callback) {
    this.#getDataEntryYaml(this.#createLearningPath, callback)
  }

  getQuickTip(callback) {
    this.#getDataEntryYaml(this.#quickTip, callback)
  }

  getOnlyTitleNoImage(callback) {
    this.#getDataEntryYaml(this.#onlyTitleNoImage, callback)
  }

  getWeekendClass(callback) {
    this.#getDataEntryYaml(this.#weekendClass, callback)
  }

  getExistingName(callback) {
    this.#getDataEntryYaml(this.#existingName, callback)
  }
}

export default CreateLearningPathYaml
