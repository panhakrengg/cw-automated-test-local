import Environment from '../../../base/Environment'
import PublishUnPublishCourse from '../../PublishUnPublishCourse'
import InstanceCreation from '../course-instance/InstanceCreation'
import LmsAdminIntercept from '../interception/LmsAdminIntercept'
import ManageCourse from './ManageCourse'

class ModifyCourseInstance {
  env = new Environment()
  manageCourse = new ManageCourse()
  instanceCreation = new InstanceCreation()
  publishUnPublishCourse = new PublishUnPublishCourse()

  clickCreateInstanceFrom3dots() {
    cy.logInTestCase(`clickCreateInstanceFrom3dots`)
    LmsAdminIntercept._itcCourseInstanceOptions.set()
    cy.get('@manageCourseCard')
      .get('.pull-right')
      .eq(1)
      .within(($threeDots) => {
        cy.wrap($threeDots).clickDropdownItem('Create an instance')
      })
    LmsAdminIntercept._itcCourseInstanceOptions.wait()
  }

  fillInstanceInfoThenSave(instanceObj) {
    cy.logInTestCase(`fillInstanceInfoThenSave`)
    this.instanceCreation.defineAliasFormElements(instanceObj.deliveryMethod, false)

    if (instanceObj.title.value) cy.get('@inputInstanceTitle').type(instanceObj.title.value)
    if (instanceObj.courseCompletion)
      cy.get('@inputCourseCompletion').type(instanceObj.courseCompletion)
    if (instanceObj.expectedDuration)
      cy.get('@inputExpectedDuration').type(instanceObj.expectedDuration)
    if (instanceObj.startDate) cy.get('@inputStartDate').type(instanceObj.startDate).blur()
    if (instanceObj.endDate) cy.get('@inputEndDate').type(instanceObj.endDate).blur()
    if (instanceObj.courseContactEmail)
      cy.get('@inputCourseEmail').type(instanceObj.courseContactEmail)
    if (instanceObj.additionalBookingNote)
      cy.get('@inputAdditionalNote').type(instanceObj.additionalBookingNote)
    if (instanceObj.courseFee) cy.get('@inputCourseFee').type(instanceObj.courseFee.value)
    if (instanceObj.maxParticipant)
      cy.get('@inputMaxParticipants').clear().type(instanceObj.maxParticipant)
    if (instanceObj.mustBookBy) cy.get('@inputMustBookBy').type(instanceObj.mustBookBy)
    if (instanceObj.mustCancelBy) cy.get('@inputMustCancelBy').type(instanceObj.mustCancelBy)

    this.instanceCreation.clickSaveInstance()
  }

  createNewCourseInstanceAndPublish(instanceObj, courseName) {
    this.manageCourse.setCourseName(courseName)
    this.manageCourse.visitManageCourse()
    this.manageCourse.searchCourseInAllInstance()
    cy.get('@manageCourseCard')
      .invoke('text')
      .then((text) => {
        if (!text.includes(this.instanceName)) {
          this.clickCreateInstanceFrom3dots()
          this.fillInstanceInfoThenSave(instanceObj)
          this.publishUnPublishCourse.publishCourseInstanceWithoutActivity()
        }
      })
  }
}

export default ModifyCourseInstance
