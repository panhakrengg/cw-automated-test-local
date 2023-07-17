import Environment from '../../base/Environment'
import UserRole from '../../utilities/user-role/UserRole'
import BookedCourseYamlStub from '../stub/BookCourseYamlStub'
import BookLearnCourseYamlStub from '../stub/BookLearnCourseYamlStub'
import ExistLearningPathYamlStub from '../stub/ExistLearningPathYamlStub'
import LmsTrainingCoPLoginStub from '../stub/LmsTrainingCoPLoginStub'
import PublishUnpublishCourseYamlStub from '../stub/PublishUnpublishCourseYamlStub'

class LmsTrainingCopBase {
  env = new Environment()
  #stubList = {
    bookCourse: new BookedCourseYamlStub(),
    bookLearnCourse: new BookLearnCourseYamlStub(),
    existLearningPath: new ExistLearningPathYamlStub(),
    publishUnpublishCourse: new PublishUnpublishCourseYamlStub(),
  }
  constructor() {
    this.stub = this.#stubList
    this.login = new LmsTrainingCoPLoginStub()
  }

  getFacilitatorUser() {
    let user = ''
    cy.stubUser(UserRole.CoPUsers.OWNER)
    cy.get('@stubUser').then((user) => {
      user = this.env.isPrd() ? user.fullName : user.screenName
    })
    return user
  }
}

export default LmsTrainingCopBase
