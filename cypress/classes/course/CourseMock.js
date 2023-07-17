import Faker from '../utilities/Faker'

class CourseMock {
  _faker = new Faker()

  getId(courseData) {
    this._faker.setPathFixture(courseData)
    return this._faker.getUrlId()
  }
}
export default CourseMock
