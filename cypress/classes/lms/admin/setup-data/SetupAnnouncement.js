import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import CourseList from './CourseList'
import LmsAdminStub from './LmsAdminStub'

class SetupAnnouncement extends LmsAdminStub {
  courseList = new CourseList()

  itcFetchAnnouncements = new InterceptReq(
    '/course_announcement/fetch_announcements',
    'FetchAnnouncements'
  )
  itcFetchAnnouncementProperties = new InterceptReq(
    'course_announcement/announcement_properties',
    'FetchAnnouncementProperties'
  )
  itcModifyCourseAnnouncement = new InterceptReq(
    '/course_announcement/modify',
    'ModifyCourseAnnouncement'
  )

  setIntercepts() {
    this.itcFetchAnnouncements.set()
    this.itcFetchAnnouncementProperties.set()
    this.itcModifyCourseAnnouncement.set()
  }

  clickCourseAnnouncementNav() {
    cy.url().then((url) => {
      const announcementUrl = url.replace('course-overview', 'course-announcements')
      cy.visit(announcementUrl)
    })
    this.itcFetchAnnouncements.wait()
  }

  clickCreateAnnouncement() {
    cy.clickButtonByName('Create announcement')
    cy.waitLoadingOverlayNotExist()
  }

  fillUrl() {
    cy.get('.input-group-prepend').within(() => {
      cy.getDropdownToggle().click()
      cy.clickLinkByName(this.announcementObj.announcementUrl.protocol)
    })
    cy.inputByPlaceholder(
      'Enter the url for this announcement',
      this.announcementObj.announcementUrl.url
    )
  }

  fillExplorationDate() {
    const expiry = this.announcementObj.expiryDate

    cy.inputByPlaceholder('Set due date', expiry.date)
    cy.inputByPlaceholder('HH:mm a', expiry.hour)
  }

  selectAnnounceTo() {
    let instances
    if (this.announcementObj.specificCourseInstances) {
      instances = this.announcementObj.specificCourseInstances

      cy.get('.cec-p-6').clickRadioButton('Specific course instances')
      instances.forEach((name) => {
        cy.getElementWithLabel(name, 'div.text-break')
          .parent()
          .within(() => {
            cy.getCheckbox().check()
          })
      })
    }
  }

  clickSave() {
    cy.clickButtonByName(Field.SAVE)
    this.itcModifyCourseAnnouncement.wait()
    cy.waitUntilToastDisappear()
  }

  fillBody() {
    cy.get('.textarea--no-resize.input-text-wrapper').within((textArea) => {
      cy.wrap(textArea).typeInTextarea(this.announcementObj.body)
    })
  }

  fillAnnouncementThenSave() {
    this.fillBody()
    this.fillUrl()
    this.fillExplorationDate()
    this.selectAnnounceTo()
    this.clickSave()
  }

  createAnnouncementFromOverview() {
    this.clickCourseAnnouncementNav()
    cy.cwTable()
      .invoke('text')
      .then((text) => {
        if (!text.includes(this.announcementObj.body)) {
          this.clickCreateAnnouncement()
          this.fillAnnouncementThenSave()
        }
      })
  }

  createAnnouncementFromCourseList() {
    this.setIntercepts()
    this.courseList.setCourse(this.courseObj)
    this.courseList.visitThenSearchCourse()
    this.courseList.clickCourseName()
    this.createAnnouncementFromOverview()
  }
}
export default SetupAnnouncement
