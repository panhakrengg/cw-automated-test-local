import EntryYamlManagement from '../../../../utilities/EntryYamlManagement'

class TrainingReportYamlStub {
  #baseTennisCourseCop = 'CourseData'
  #baseLearnTennisTrainingCop = 'CopInfo.trainingCop.learnTennis'

  getCopInfoYaml(dataEntryCallback) {
    const pathUnderFixture = 'lms-training-cop/cop-info'
    this.#getDataEntryYaml(pathUnderFixture, this.#baseLearnTennisTrainingCop, dataEntryCallback)
  }

  getCopCourseYaml(dataEntryCallback) {
    const pathUnderFixture = 'lms-training-cop/publish-unpublish-course'
    this.#getDataEntryYaml(pathUnderFixture, this.#baseTennisCourseCop, dataEntryCallback)
  }

  #getDataEntryYaml(pathUnderFixture, baseYamlPath, dataEntryCallback) {
    EntryYamlManagement._readDataEntry(pathUnderFixture, baseYamlPath, dataEntryCallback)
  }
}

export default TrainingReportYamlStub
