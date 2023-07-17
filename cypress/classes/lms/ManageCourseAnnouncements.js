import moment from 'moment'
import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import DateFormat from '../format-collections/DateFormat'
import EmailHelper from '../utilities/EmailHelper'
import LearningAdmin from './LearningAdmin'

class ManageCourseAnnouncements extends LearningAdmin {
  _itcFetchAnnouncement = new InterceptReq(
    '/course_announcement/fetch_announcement',
    'FetchAnnouncement'
  )
  _itcModifyAnnouncement = new InterceptReq('/course_announcement/modify', 'ModifyAnnouncement')

  accessManageCourseAnnouncementBy(fullCatalogId, courseId) {
    cy.visit(
      this.getFullCatalogUrl(fullCatalogId) +
        `/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=course-announcements`
    )
  }
  clickButtonCreateNewAnnouncement() {
    this._itcFetchAnnouncement.set()
    cy.getElementWithLabel('Create announcement', 'button').should('be.visible').click()
    this._itcFetchAnnouncement.wait()
  }
  fillInAnnouncementBody(announcementBody) {
    cy.get('.input-text-wrapper').last().should('be.visible').type(announcementBody)
  }
  fillInAnnouncementUrl() {
    cy.inputByPlaceholder('Enter the url for this announcement', location.hostname)
  }
  fillInAnnouncementExpiredDate() {
    cy.inputByPlaceholder(
      'Set due date',
      moment().add(1, 'days').format(DateFormat.EDIT_ANNOUNCEMENT_EXPIRY_DATE)
    )
  }
  fillInAnnouncementHour() {
    cy.inputByPlaceholder('HH:mm a', '11:00 pm')
  }
  clickButtonSaveAnnouncement() {
    this._itcModifyAnnouncement.set()
    cy.clickPrimaryButton(Field.SAVE)
    this._itcModifyAnnouncement.wait()
    cy.waitLoadingOverlayNotExist()
    this.showSuccessSaveAnnouncementToastMessage()
  }
  showSuccessSaveAnnouncementToastMessage() {
    cy.expectToastMessage('This announcement has been saved.')
  }
  updateTimezone(timezone) {
    cy.waitLoadingOverlayNotExist()
    cy.getElementWithLabel('Time Zone', 'label')
      .parent()
      .within(($timezone) => {
        cy.wrap($timezone).clickDropdownSelect(timezone)
      })
  }
  verifyReceiveEmailForCreateNewAnnouncement() {
    const emailHelper = new EmailHelper()
    emailHelper
      .getReceivedEmailBySubjectCount(
        'New Announcement in the Course Time Zone (Automation Do not Delete) course!',
        'au_timez_jp_prefer@yopmail.com',
        true
      )
      .should('have.length', '1')
  }
  publishAnnouncement() {
    cy.get('.cec-card__header').then(($header) => {
      cy.wrap($header).toggleSwitch()
      cy.get('body').then(($body) => {
        if ($body.find('.swal2-container').length) {
          this.confirmPublishAnnouncement()
        }
      })
    })
  }
  confirmPublishAnnouncement() {
    cy.swal2().within(($swal2) => {
      cy.wrap($swal2).swal2Confirm(Field.PUBLISH).click()
    })
  }
  createNewAnnouncementFor(orgFullCatalogId, courseId, announcementBody) {
    this.accessManageCourseAnnouncementBy(orgFullCatalogId, courseId)
    this.clickButtonCreateNewAnnouncement()
    this.fillInAnnouncementBody(announcementBody)
    this.fillInAnnouncementUrl()
    this.updateTimezone('(UTC -7:0) GMT-07:00 (Etc/GMT+7)')
    this.fillInAnnouncementExpiredDate()
    this.fillInAnnouncementHour()
    this.clickButtonSaveAnnouncement()
    this.publishAnnouncement()
  }
  deleteCourseAnnouncementBy(title) {
    cy.getElementWithLabel(title, 'a').siblings('input').check()
    cy.getElementWithLabel(Field.DELETE, 'button').click()
  }

  deleteCourseAnnouncements(title) {
    cy.cwTable()
      .invoke('text')
      .then((text) => {
        if (text.includes(title)) {
          cy.get('.checkbox-minus input').check()
          cy.getElementWithLabel(Field.DELETE, 'button').click()
          this.confirmDeleteAnnouncement()
        }
      })
  }
  confirmDeleteAnnouncement() {
    cy.swal2().within(($swal2) => {
      cy.wrap($swal2).swal2Confirm(Field.YES_DELETE).click()
    })
  }
}

export default ManageCourseAnnouncements
