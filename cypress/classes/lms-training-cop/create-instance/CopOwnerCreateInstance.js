import DeliveryMethod from '../../constants/course/DeliveryMethod'
import Story from '../../Story'
import SignInAs from '../../utilities/SignInAs'
import CreateInstanceBase from './CreateInstanceBase'

class CopOwnerCreateInstance extends CreateInstanceBase {
  #ticketNumber
  #deliveryMethod
  setDeliveryMethod(deliveryMethod) {
    this.#deliveryMethod = deliveryMethod
  }
  setTicketNumber(ticketNumber) {
    this.#ticketNumber = ticketNumber
  }
  login() {
    SignInAs.copOwner()
  }
  before() {
    this._yamlHelper.read().then(({ CourseData, CreateInstances }) => {
      this._course = CourseData.newCourseInstanceFunc
      this._courseName = this._course.name
      this._faker.setPathFixture(this._course)
      this._courseId = this._faker.getUrlId()
      this._instance = CreateInstances[this.getInstanceFieldType()]
      this._copManageInstance.setCourseAndInstance(this._course, this._instance)
      this._instanceOverview.setCourseAndInstance(this._course, this._instance)
      this._copManageCourse.setCourse(this._course)
    })
  }
  getType() {
    return this.#deliveryMethod
  }
  linkJiraTicket() {
    Story.ticket(this.#ticketNumber)
  }
  getInstanceFieldType() {
    if (this.#deliveryMethod === DeliveryMethod.SELF_STUDY) {
      return 'selfStudy'
    } else if (this.#deliveryMethod === DeliveryMethod.PHYSICAL_CLASSROOM) {
      return 'physicalClass'
    } else if (this.#deliveryMethod === DeliveryMethod.VIRTUAL_CLASSROOM) {
      return 'virtualClass'
    } else if (this.#deliveryMethod === DeliveryMethod.BLENDED_LEARNING) {
      return 'blendedLearning'
    }
  }
}

export default CopOwnerCreateInstance
