import Field from '../../../../constants/Field'
import {
  AnnounceTo,
  AnnouncementLabel,
  AnnouncementPlaceholder,
  AnnouncementStatus,
} from '../constant/CourseAnnouncementsConstant'
import CourseAnnouncementsQueries from '../queries/CourseAnnouncementsQueries'

class CourseAnnouncementsAssertions extends CourseAnnouncementsQueries {
  #expectToSeeToastMessage() {
    cy.expectToastMessage('This announcement has been saved.')
    cy.waitUntilToastDisappear()
  }

  #expectPageStillInModify() {
    cy.getTextareaByLabel(AnnouncementLabel.ANNOUNCEMENT_BODY).should('be.visible')
  }

  #expectToSeeOnly1AnnounceTo(announceTo) {
    if (announceTo == AnnounceTo.ALL_COURSE_INSTANCES) {
      cy.expectElementWithLabelVisible(AnnounceTo.ALL_COURSE_INSTANCES)
      cy.expectElementWithLabelNotExist(AnnounceTo.SPECIFIC_COURSE_INSTANCES)
    } else {
      cy.expectElementWithLabelVisible(AnnounceTo.SPECIFIC_COURSE_INSTANCES)
      cy.expectElementWithLabelNotExist(AnnounceTo.ALL_COURSE_INSTANCES)
    }
  }

  #expectButtonSaveDisabled() {
    cy.expectButtonWithLabelAndDisabled(Field.SAVE)
  }

  #expectTogglePublishAnnouncementTurnOff() {
    cy.cardRightContent().then(($right) => {
      cy.wrap($right)
        .cwToggleButton(AnnouncementLabel.PUBLISH_ANNOUNCEMENT)
        .toggleIsValidState(false)
    })
  }

  expectSpecificInstancesTable(announcement) {
    const { specificCourseInstances, notAnnounceTo } = announcement
    if (specificCourseInstances) this.#expectToSeeCourseInstancesChecked(specificCourseInstances)
    if (notAnnounceTo) this.#expectToSeeCourseInstancesNotChecked(notAnnounceTo)
  }

  #verifyAnnouncementInfoInCreation(announcement) {
    const { body, announcementUrl, timeZone, expiryDate } = announcement

    super.getModifyAnnouncementBody().within(() => {
      cy.expectTextareaValue(AnnouncementLabel.ANNOUNCEMENT_BODY, body)
      cy.expectDropdownToggleValue(announcementUrl.protocol)
      cy.expectInputValueByPlaceholder(AnnouncementPlaceholder.ENTER_THE_URL, announcementUrl.url)
      cy.expectSelectHaveText(timeZone)
      cy.expectInputValueByPlaceholder(AnnouncementPlaceholder.SET_DUE_DATE, expiryDate.date)
      cy.expectInputValueByPlaceholder(AnnouncementPlaceholder.HH_MM_A, expiryDate.hour)
      this.expectSpecificInstancesTable(announcement)
    })
  }

  #expectToSeeCourseInstancesChecked(instances) {
    instances.forEach((instance) => {
      cy.cwTable()
        .rowName(instance)
        .within(() => {
          cy.isCheckboxDisabled().isChecked()
        })
    })
  }

  #expectToSeeCourseInstancesNotChecked(instances) {
    instances.forEach((instance) => {
      cy.cwTable()
        .rowName(instance)
        .within(() => {
          cy.isCheckboxDisabled().isUnchecked()
        })
    })
  }

  #expectAnnounceToInList(wrapper, announcement) {
    const { announceTo, specificCourseInstances } = announcement

    if (announceTo == AnnounceTo.ALL_COURSE_INSTANCES)
      expect(wrapper).to.contains.text(AnnounceTo.ALL_INSTANCES)
    if (specificCourseInstances) {
      const totalInstance = announcement.specificCourseInstances.length
      const instanceLabel = super.getInstanceLabel(totalInstance)
      expect(wrapper).to.contains.text(`${totalInstance} ${instanceLabel}`)
    }
  }

  expectToSeeTotalAnnounceTo(annmentBody, totalInstance) {
    const instanceLabel = super.getInstanceLabel(totalInstance)
    super.getAnnouncementRow(annmentBody).within(($row) => {
      expect($row).to.contains.text(`${totalInstance} ${instanceLabel}`)
    })
  }

  verifyAnnouncementCreateSuccessfully(announcement) {
    this.#expectToSeeToastMessage()
    this.#expectPageStillInModify()
    this.#expectToSeeOnly1AnnounceTo(announcement.announceTo)
    this.#expectButtonSaveDisabled()
    this.#expectTogglePublishAnnouncementTurnOff()
    this.#verifyAnnouncementInfoInCreation(announcement)
  }

  verifyAnnouncementCannotCreateMoreThen255(announcement) {
    const { body } = announcement
    this.#expectToSeeToastMessage()
    this.#expectPageStillInModify()
    cy.expectTextareaNotContainValue(AnnouncementLabel.ANNOUNCEMENT_BODY, body)
    cy.expectTextareaValue(
      AnnouncementLabel.ANNOUNCEMENT_BODY,
      super.getFirst255AnnouncementBody(body)
    )
    cy.expectElementWithLabelVisible(`${AnnouncementLabel[255]}/${AnnouncementLabel[255]}`, 'span')
  }

  verifyAnnouncementRow(announcement, authorName) {
    const annmentBody = super.getFirst255AnnouncementBody(announcement.body)

    super.getAnnouncementRow(annmentBody).then(($row) => {
      expect($row).have.length(1)
      expect($row).to.contains.text(annmentBody)
      this.#expectAnnounceToInList($row, announcement)
      expect($row).to.contains.text(authorName)
      expect($row).to.contains.text(AnnouncementStatus.ACTIVE)
    })
  }
  expectAnnouncementDeleted(annmentBody) {
    cy.cwTable().within(() => {
      cy.expectElementWithLabelNotExist(annmentBody)
    })
  }
}
export default CourseAnnouncementsAssertions
