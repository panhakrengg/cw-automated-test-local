import EntryYamlManagement from '../../utilities/EntryYamlManagement'

class ExistLearningPathYamlStub {
  #courseData = 'CourseData'
  #tennisByYourself = 'CourseData.tennisByYourself'
  #tennisWarmUpGuide = 'CourseData.tennisWarmUpGuide'
  #acceptedForEveryone = 'CourseData.acceptedForEveryone'
  #basicHtml = 'CourseData.basicHtml'
  #scoreInTennis = 'CourseData.scoreInTennis'
  #completedCourse = 'CourseData.completedCourse'

  #learningPathData = 'LearningPathData'
  #tennisCityClub = 'LearningPathData.tennisCityClub'
  #firstClassInCityClub = 'LearningPathData.firstClassInCityClub'
  #shortTerm = 'LearningPathData.shortTerm'
  #childCourse = 'LearningPathData.childCourse'
  #missionEvening = 'LearningPathData.missionEvening'

  #getDataEntryYaml(baseYamlPath, dataCallback) {
    const pathUnderFixture = 'lms-training-cop/learning-paths/exist-learning-path'
    EntryYamlManagement._readDataEntry(pathUnderFixture, baseYamlPath, dataCallback)
  }

  getCourseData(dataCallback) {
    return this.#getDataEntryYaml(this.#courseData, dataCallback)
  }

  getLearningPathData(dataCallback) {
    return this.#getDataEntryYaml(this.#learningPathData, dataCallback)
  }

  getTennisByYourself(dataCallback) {
    return this.#getDataEntryYaml(this.#tennisByYourself, dataCallback)
  }

  getTennisWarmUpGuide(dataCallback) {
    return this.#getDataEntryYaml(this.#tennisWarmUpGuide, dataCallback)
  }

  getAcceptedForEveryone(dataCallback) {
    return this.#getDataEntryYaml(this.#acceptedForEveryone, dataCallback)
  }

  getBasicHtml(dataCallback) {
    return this.#getDataEntryYaml(this.#basicHtml, dataCallback)
  }

  getScoreInTennis(dataCallback) {
    return this.#getDataEntryYaml(this.#scoreInTennis, dataCallback)
  }

  getCompletedCourse(dataCallback) {
    return this.#getDataEntryYaml(this.#completedCourse, dataCallback)
  }

  getTennisCityClub(dataCallback) {
    return this.#getDataEntryYaml(this.#tennisCityClub, dataCallback)
  }

  getFirstClassInCityClub(dataCallback) {
    return this.#getDataEntryYaml(this.#firstClassInCityClub, dataCallback)
  }

  getShortTerm(dataCallback) {
    return this.#getDataEntryYaml(this.#shortTerm, dataCallback)
  }

  getChildCourse(dataCallback) {
    return this.#getDataEntryYaml(this.#childCourse, dataCallback)
  }

  getMissionEvening(dataCallback) {
    this.#getDataEntryYaml(this.#missionEvening, dataCallback)
  }
}

export default ExistLearningPathYamlStub
