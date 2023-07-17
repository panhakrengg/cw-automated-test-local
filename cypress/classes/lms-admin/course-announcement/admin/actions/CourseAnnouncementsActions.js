import Field from '../../../../constants/Field'
import { AnnouncementLabel, AnnouncementPlaceholder } from '../constant/CourseAnnouncementsConstant'
import CourseAnnouncementsItc from '../intercepts/CourseAnnouncementsItc'
import CourseAnnouncementsQueries from '../queries/CourseAnnouncementsQueries'

class CourseAnnouncementsActions extends CourseAnnouncementsQueries {
  visitCourseAnnouncements(courseId) {
    CourseAnnouncementsItc.fetchAnnouncements.set()
    cy.visit(super.getCourseAnnouncementsUrl(courseId))
    CourseAnnouncementsItc.fetchAnnouncements.wait()
  }

  clickAnnouncement(annmentBody) {
    cy.clickLinkByName(annmentBody)
    cy.waitLoadingOverlayNotExist()
  }

  #clickButtonCreateAnnouncement() {
    cy.clickButtonByName(AnnouncementLabel.CREATE_ANNOUNCEMENT)
    cy.waitLoadingOverlayNotExist()
  }

  #fillAnnouncementBody(body) {
    cy.typeTextareaByLabel(AnnouncementLabel.ANNOUNCEMENT_BODY, body)
  }

  #fillAnnouncementUrl(announcementUrl) {
    super.getModifyAnnouncementBody().within(() => {
      cy.clickDropdownItemInDropdownToggle(announcementUrl.protocol)
      cy.inputByPlaceholder(AnnouncementPlaceholder.ENTER_THE_URL, announcementUrl.url)
    })
  }

  #selectTimeZone(timeZone) {
    super.getTimeZoneDropdown().then(() => {
      cy.clickDropdownSelect(timeZone)
    })
  }

  #fillExpiryDate(date) {
    cy.inputByPlaceholder(AnnouncementPlaceholder.SET_DUE_DATE, date)
  }

  #fillHour(hour) {
    cy.inputByPlaceholder(AnnouncementPlaceholder.HH_MM_A, hour)
  }

  #selectAnnounceTo(announceTo) {
    cy.clickRadioButton(announceTo)
  }

  #checkCourseInstances(instances) {
    instances.forEach((instance) => {
      cy.cwTable()
        .rowName(instance)
        .within(() => {
          cy.getCheckbox().check()
        })
    })
  }

  #clickButtonSave() {
    CourseAnnouncementsItc.modifyCourseAnnouncement.set()
    cy.clickButtonByName(Field.SAVE)
    CourseAnnouncementsItc.modifyCourseAnnouncement.wait()
  }

  clickButtonCancel() {
    CourseAnnouncementsItc.fetchAnnouncements.set()
    cy.clickButtonByName(Field.CANCEL)
    CourseAnnouncementsItc.fetchAnnouncements.wait()
  }

  #checkAnnouncement(announcementBody) {
    super.getAnnouncementRow(announcementBody).within(() => {
      cy.getCheckbox().check()
    })
  }

  checkAllAnnouncements(announcementBody) {
    super.getAnnouncementRow(announcementBody).each(($row) => {
      cy.wrap($row).within(() => {
        cy.getCheckbox().check()
      })
    })
  }

  #clickButtonDelete() {
    cy.clickButtonByName(Field.DELETE)
  }

  #clickButtonYesDelete() {
    CourseAnnouncementsItc.deleteAnnouncements.set()
    cy.clickButtonByName(Field.YES_DELETE)
    CourseAnnouncementsItc.deleteAnnouncements.wait()
  }

  #fillAnnouncementInfo(announcement) {
    const { body, announcementUrl, timeZone, expiryDate, announceTo, specificCourseInstances } =
      announcement

    this.#fillAnnouncementBody(body)
    if (announcementUrl) this.#fillAnnouncementUrl(announcementUrl)
    if (timeZone) this.#selectTimeZone(timeZone)
    this.#fillExpiryDate(expiryDate.date)
    this.#fillHour(expiryDate.hour)
    this.#selectAnnounceTo(announceTo)
    if (specificCourseInstances) this.#checkCourseInstances(specificCourseInstances)
  }

  createNewAnnouncement(announcement) {
    this.#clickButtonCreateAnnouncement()
    this.#fillAnnouncementInfo(announcement)
    this.#clickButtonSave()
  }

  publishAnnouncement() {
    super.getTogglePublishValidState().then((isValidState) => {
      if (!isValidState) {
        CourseAnnouncementsItc.publishCourseAnnouncement.set()
        this.#switchTogglePublishAnnouncement()
        this.#clickButtonPublishInPopup()
        CourseAnnouncementsItc.publishCourseAnnouncement.wait()
      }
    })
  }

  unpublishAnnouncement() {
    super.getTogglePublishValidState().then((isValidState) => {
      if (isValidState) {
        CourseAnnouncementsItc.publishCourseAnnouncement.set()
        this.#switchTogglePublishAnnouncement()
        CourseAnnouncementsItc.publishCourseAnnouncement.wait()
      }
    })
  }

  createThenPublishAnnouncement(announcement) {
    this.createNewAnnouncement(announcement)
    this.publishAnnouncement()
  }

  #switchTogglePublishAnnouncement() {
    cy.waitUntilToastDisappear()
    cy.cardRightContent().then(($right) => {
      cy.wrap($right).cwToggleButton(AnnouncementLabel.PUBLISH_ANNOUNCEMENT).toggleSwitch()
    })
  }

  #clickButtonPublishInPopup() {
    super.getIsButtonPopupVisible().then((isPopupVisible) => {
      if (isPopupVisible)
        cy.swal2().within(() => {
          cy.clickButtonByName(Field.PUBLISH)
        })
    })
  }

  deleteAnnouncement(announcementBody) {
    this.#checkAnnouncement(announcementBody)
    this.#clickButtonDelete()
    this.#clickButtonYesDelete()
  }

  deleteAllAnnouncements(announcementBody) {
    let annment = super.getFirst255AnnouncementBody(announcementBody)
    cy.cwTable().getAllTableRows().as('tableRow')
    cy.wait(1000) // wait for data appear
    cy.get('@tableRow')
      .invoke('text')
      .then((text) => {
        if (text.includes(annment)) {
          this.checkAllAnnouncements(annment)
          this.#clickButtonDelete()
          this.#clickButtonYesDelete()
        }
      })
  }

  reloadPage() {
    CourseAnnouncementsItc.fetchAnnouncements.set()
    cy.reload()
    CourseAnnouncementsItc.fetchAnnouncements.wait()
  }
}
export default CourseAnnouncementsActions
