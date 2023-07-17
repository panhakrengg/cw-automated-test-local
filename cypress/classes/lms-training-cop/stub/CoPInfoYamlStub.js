import Environment from '../../base/Environment'
import EntryYamlManagement from '../../utilities/EntryYamlManagement'

class CoPInfoYamlStub {
  #tCopLearnTennis = 'CopInfo.trainingCop.learnTennis'
  #tCoPPaintingPictures = 'CopInfo.trainingCop.paintingPictures'
  #tCoPtCopFilter = 'CopInfo.trainingCop.tCopFilter'
  #pathUnderFixture = 'lms-training-cop/cop-info'

  #getDataEntryYaml(baseYamlPath, dataCallback) {
    EntryYamlManagement._readDataEntry(this.#pathUnderFixture, baseYamlPath, dataCallback)
  }

  learnTennisUrl(cop) {
    return cop.url[new Environment().getEnvYaml()]
  }

  setLearnerLearnTennisUrl(learningCop) {
    this.#getDataEntryYaml(this.#tCopLearnTennis , (learningTennis) => {
      learningCop.setTrainingCopUrl(this.learnTennisUrl(learningTennis))
    })
  }

  setAdminLearnTennisUrl(copManageCourse) {
    this.#getDataEntryYaml(this.#tCopLearnTennis, (learningTennis) => {
      copManageCourse.setCopAdminUrl(this.learnTennisUrl(learningTennis))
    })
  }

  getTCoPLearnTennis(dataCallback) {
    this.#getDataEntryYaml(this.#tCopLearnTennis, dataCallback)
  }

  getTCoPPaintingPictures(dataCallback) {
    this.#getDataEntryYaml(this.#tCoPPaintingPictures, dataCallback)
  }

  getTCoPtCopFilter(dataCallback) {
    this.#getDataEntryYaml(this.#tCoPtCopFilter, dataCallback)
  }
}

export default CoPInfoYamlStub
