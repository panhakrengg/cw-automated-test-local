import EntryYamlManagement from '../../utilities/EntryYamlManagement'

class BookedCourseYamlStub {
  #tennisByYourself = 'CourseData.tennisByYourself'
  #freeCourse = 'BookingCourse.freeCourse'
  #prePaidCourse = 'BookingCourse.prePaidCourse'

  #lpFirstClass = 'LearningPathData.firstClass'
  #getDataEntryYaml(baseYamlPath, dataCallback) {
    const pathUnderFixture = 'lms-training-cop/course-instances/book-course'
    EntryYamlManagement._readDataEntry(pathUnderFixture, baseYamlPath, dataCallback)
  }

  getTennisByYourself(dataCallback) {
    this.#getDataEntryYaml(this.#tennisByYourself, dataCallback)
  }

  getFreeCourse(dataCallback) {
    this.#getDataEntryYaml(this.#freeCourse, dataCallback)
  }

  getLpFirstClass(dataCallback) {
    this.#getDataEntryYaml(this.#lpFirstClass, dataCallback)
  }

  getPrePaidCourse(dataCallback) {
    this.#getDataEntryYaml(this.#prePaidCourse, dataCallback)
  }
}

export default BookedCourseYamlStub
