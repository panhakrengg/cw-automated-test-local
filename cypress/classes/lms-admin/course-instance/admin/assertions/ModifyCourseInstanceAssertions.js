import { CreateInstanceConstant } from '../constant/CreateInstanceConstant'
import ModifyCourseInstanceQueries from '../queries/ModifyCourseInstanceQueries'

class ModifyCourseInstanceAssertions extends ModifyCourseInstanceQueries {
  expectToSeeSuccessMessageSaveCourseInstance() {
    cy.expectToastMessage('The course instance has been saved.')
  }

  expectToSeeSaveButtonEnabled() {
    cy.expectButtonWithLabelAndEnabled(CreateInstanceConstant.SAVE_INSTANCE)
  }

  expectToStayInEditCourseInstance() {
    cy.getElementWithLabel('Edit Instance', 'a').should('have.class', 'active')
  }

  expectToSeeCourseInstanceDetails(instanceObj) {
    super.getCourseInstanceTitleInput().should('have.value', instanceObj.title.value)
    super.getCourseCompletion().should('have.value', instanceObj.courseCompletion)
    super.getExpectedDuration().should('have.value', instanceObj.expectedDuration)
    super.getTheFirstSelectBadgeLanguage().should('contain.text', instanceObj.language[0])
    super.getStartDateInput().should('have.value', instanceObj.startDate)
    super.getTimeZoneSelect().should('have.value', instanceObj.timezone)
    super.getEndDateInput().should('have.value', instanceObj.endDate)
    super.getMaxParticipantsInput().should('have.value', instanceObj.maxParticipant)
    super.getMustBookByInput().should('have.value', instanceObj.mustBookBy)
    super.getMustCancelByInput().should('have.value', instanceObj.mustCancelBy)
    super.getContactEmailInput().should('have.value', instanceObj.courseContactEmail)
    super.getBookNoteTextarea().should('have.value', instanceObj.additionalBookingNote)
    super.getCourseFee().should('have.value', instanceObj.courseFee.value)
  }
}

export default ModifyCourseInstanceAssertions
