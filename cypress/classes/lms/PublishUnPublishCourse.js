import CopManageCourse from '../lms-training-cop/CopManageCourse'
import WebNotification from '../notification/WebNotification'
import Field from '../constants/Field'

class PublishUnPublishCourse extends CopManageCourse {
  constructor() {
    super()
  }

  publish() {
    this.isPublished().then(($isPublished) => {
      if (!$isPublished) {
        this._itcUpdateCourseStatus.set()
        this.getToggle().first().check({ force: true })
        this._itcUpdateCourseStatus.wait()
      }
    })
  }

  unPublish() {
    this.isPublished().then(($isPublished) => {
      if ($isPublished) {
        this.getToggle().first().uncheck({ force: true })
        this._itcUpdateCourseStatus.set()
        cy.swal2Confirm(Field.YES_UN_PUBLISH).click()
        this._itcUpdateCourseStatus.wait()
      }
    })
  }

  publishCourseInstance() {
    this.isPublished().then(($isPublished) => {
      if (!$isPublished) {
        this._itcCourseInstancePublish.set()
        this.getToggle().check({ force: true })
        this._itcCourseInstancePublish.wait()
      }
    })
  }

  publishCourseInstanceWithoutActivity() {
    this.isPublished().then(($isPublished) => {
      if (!$isPublished) {
        this._itcCourseInstancePublish.set()
        this.getToggle().check({ force: true })
        cy.swal2Confirm(Field.PUBLISH).click()
        this._itcCourseInstancePublish.wait()
      }
    })
  }

  unPublishCourseInstance() {
    this.isPublished().then(($isPublished) => {
      if ($isPublished) {
        this.getToggle().uncheck({ force: true })
        this._itcCourseInstancePublish.set()
        cy.swal2Confirm(Field.YES_UN_PUBLISH).click()
        this._itcCourseInstancePublish.wait()
      }
    })
  }

  isPublished() {
    cy.wait(300) // Note: Invoke check immediately
    return this.getToggle().invoke('prop', 'checked')
  }

  getToggle() {
    return cy.cecCard().cardRightContent().find('.cw-toggle-button > label > input')
  }

  expectToSeeUpdateCourseNotification(actorName, courseName) {
    return new WebNotification()
      .getNotificationOfUpdateCourse(actorName, courseName)
      .should('be.visible')
  }

  expectPublished() {
    this.getToggle().should('be.checked')
  }

  expectUnPublished() {
    this.getToggle().should('not.be.checked')
  }
}

export default PublishUnPublishCourse
