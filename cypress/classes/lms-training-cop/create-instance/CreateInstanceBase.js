import Environment from '../../base/Environment'
import WebNotification from '../../notification/WebNotification'
import Faker from '../../utilities/Faker'
import SignInAs from '../../utilities/SignInAs'
import YamlHelper from '../../utilities/YamlHelper'
import CopManageCourse from '../CopManageCourse'
import CopManageInstance from '../CopManageInstance'
import InstanceOverview from '../InstanceOverview'
import { CoPConst } from '../base/CoPStub'

class CreateInstanceBase {
  _course
  _courseId
  _instance
  _courseName
  _faker = new Faker()
  _webNotification = new WebNotification()
  _copManageCourse = new CopManageCourse()
  _instanceOverview = new InstanceOverview()
  _copManageInstance = new CopManageInstance(`${CoPConst.URL}/admin/admin`)
  _yamlHelper = new YamlHelper('lms-training-cop/course-instances/create-instance')
  login() {
    throw Error('You have to implement the method loginAs!')
  }
  before() {
    throw Error('You have to implement the method before to fetch mockup data!')
  }
  getType() {
    throw Error('You have to implement the method getType!')
  }
  linkJiraTicket() {
    throw Error('You have to implement the method linkJiraTicket!')
  }
  execute() {
    before(() => {
      this.before()
    })
    it(`CoP Owner create new instance as ${this.getType()}`, () => {
      this.linkJiraTicket()
      this.login()

      context('Reset data', () => {
        this._copManageInstance.goToCourseInstances(this._courseId)
        this._copManageInstance.archiveInstancesByDate()
        this._copManageInstance.deleteArchiveInstancesByDate()
      })

      context(`CoP Owner create new instance as ${this.getType()}`, () => {
        this._copManageInstance.goToCreateInstance(this._courseId)
        this._copManageInstance.getDeliveryMethod(this.getType()).click()
        this._copManageInstance.editInstance()
        this._copManageInstance.clickOnSaveInstance()
        this._instanceOverview.verifyNewInstanceOverview()
        this._copManageInstance.clickOnEditInstanceTab()
        this._copManageInstance.verifyStartTimeAndEndTime()
      })
      context('Another CoP admin verify new course instance created', () => {
        SignInAs.reSignInAsCopAdmin()
        this._copManageCourse._itcFetchCourseActivities.set()
        this._webNotification
          .getNotificationOfCreateAnInstanceInTheCourse(
            this._instance.createdByScreenName[new Environment().getEnvYaml()],
            this._courseName
          )
          .should('be.visible')
          .click()
        this._copManageCourse._itcFetchCourseActivities.wait()
        this._instanceOverview.verifyNewInstanceOverview()
      })
    })
  }
}

export default CreateInstanceBase
