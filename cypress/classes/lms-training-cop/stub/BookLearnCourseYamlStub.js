import EntryYamlManagement from '../../utilities/EntryYamlManagement'

class BookLearnCourseYamlStub {
  #bookedCourse = 'BookedCourse'
  #learningPath = 'BookedCourse.learningPath'
  #getDataEntryYaml(baseYamlPath, dataCallback) {
    const pathUnderFixture = 'lms-training-cop/course-instances/book-learn-course'
    EntryYamlManagement._readDataEntry(pathUnderFixture, baseYamlPath, dataCallback)
  }

  getBookedCourse(learningPath) {
    return this.#getDataEntryYaml(this.#bookedCourse, (bookedCourse) => {
      const course = bookedCourse.learningPath
      course.date = learningPath.date
      course.deliveryMethod = learningPath.deliveryMethod
      return course
    })
  }

  getLearningPath(dataCallback) {
    this.#getDataEntryYaml(this.#learningPath, dataCallback)
  }
}

export default BookLearnCourseYamlStub
