import EntryYamlManagement from '../../utilities/EntryYamlManagement'

class PublishUnpublishCourseYamlStub {
  #scoreInTennis = 'CourseData.scoreInTennis'
  #typedRacket = 'CourseData.typedRacket'
  #planNextCourse = 'CourseData.planNextCourse'
  #acceptedForEveryone = 'CourseData.acceptedForEveryone'
  #tennisByYourself = 'CourseData.tennisByYourself'
  #practiceMorning = 'CourseData.practiceMorning'
  #onlineTraining = 'CourseData.onlineTraining'

  #getDataEntryYaml(baseYamlPath, dataCallback) {
    const pathUnderFixture = 'lms-training-cop/publish-unpublish-course'
    EntryYamlManagement._readDataEntry(pathUnderFixture, baseYamlPath, dataCallback)
  }

  getScoreInTennis(dataCallback) {
    this.#getDataEntryYaml(this.#scoreInTennis, dataCallback)
  }

  getTypedRacket(dataCallback) {
    this.#getDataEntryYaml(this.#typedRacket, dataCallback)
  }

  getPlanNextCourse(dataCallback) {
    this.#getDataEntryYaml(this.#planNextCourse, dataCallback)
  }

  getAcceptedForEveryone(dataCallback) {
    this.#getDataEntryYaml(this.#acceptedForEveryone, dataCallback)
  }

  getTennisByYourself(dataCallback) {
    this.#getDataEntryYaml(this.#tennisByYourself, dataCallback)
  }

  getPracticeMorning(dataCallback) {
    this.#getDataEntryYaml(this.#practiceMorning, dataCallback)
  }

  getOnlineTraining(dataCallback) {
    this.#getDataEntryYaml(this.#onlineTraining, dataCallback)
  }
}

export default PublishUnpublishCourseYamlStub
