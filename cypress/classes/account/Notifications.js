import moment from 'moment'
import InterceptReq from '../base/InterceptReq'
import DateFormat from '../format-collections/DateFormat'
import Learning from '../lms/Learning'
import WebNotification from '../notification/WebNotification'
import ManageCourseConsent from '../org-management/org-admin/ManageCourseConsent'
import Account from './Account'
import NotificationsConstants from '../constants/my-account/NotificationsConstants'

class Notifications extends Account {
  #webNotification = new WebNotification()

  _itcFetchAccountSettings = new InterceptReq('/account_settings/fetch', 'FetchAccountSettings')
  _itcModifyAccountSettings = new InterceptReq('/account_settings/modify', 'ModifyAccountSettings')
  accessNotificationPage() {
    this._itcFetchAccountSettings.set()
    cy.visit(`/web/my-profile/account-settings#_accountSettingPortlet_option=notifications`)
    this._itcFetchAccountSettings.wait()
  }
  getNotificationItemWrapperElementBy(name) {
    cy.getElementWithLabel(name, 'span').parents('.row.cec-px-6').as('notificationWrapper')
  }
  optOutNotificationItemBy(name) {
    this._itcModifyAccountSettings.set()
    this.getNotificationItemWrapperElementBy(name)
    cy.get('@notificationWrapper').within(() => {
      cy.getCheckbox().first().uncheck()
      cy.getCheckbox().last().uncheck()
    })
    this._itcModifyAccountSettings.getResponse().then(() => {
      this.showSuccessfullySaveNotificationToast()
    })
  }
  optInNotificationItemBy(name) {
    this.getNotificationItemWrapperElementBy(name)
    cy.get('@notificationWrapper').within(() => {
      cy.getCheckbox().first().check()
      cy.getCheckbox().last().check()
    })
  }
  showSuccessfullySaveNotificationToast() {
    cy.expectToastMessage('Notifications saved.')
  }
  removeMemberFromCourseInstanceBy(instanceId, courseId, memberEmail, orgName) {
    const manageCourseConsent = new ManageCourseConsent()
    manageCourseConsent.accessToCiManagePeopleBy(instanceId, courseId, orgName)
    manageCourseConsent.removeCourseInstanceMember(memberEmail)
  }
  optInNotificationBy() {
    this.accessNotificationPage()
    this.optInNotificationItemBy(NotificationsConstants.FACILITATOR_NOTIFICATION)
  }
  removeMemberFromInstanceAndOptInNotificationBy(
    instanceId,
    courseId,
    memberEmail,
    notificationName,
    orgName
  ) {
    this.removeMemberFromCourseInstanceBy(instanceId, courseId, memberEmail, orgName)
    this.optInNotificationBy(notificationName)
  }
  removeTheLastNotificationWith(content) {
    this.#webNotification.clickOnWebNotificationIcon()
    this.#webNotification.getTheLastNotificationItem()
    cy.get('@notificationItem').then(($notificationItem) => {
      if ($notificationItem.find(`.notification-body:contains("${content}")`).length) {
        this.#webNotification.deleteTheLastNotificationItem()
      }
    })
  }
  verifyNotReceiveBookCourseWebNotificationBy(screenName, courseTitle) {
    const webNotification = new WebNotification()
    webNotification.clickOnWebNotificationIcon()
    webNotification.getTheLastNotificationItem()
    cy.get('@notificationItem').within(() => {
      cy.get('.notification-body').should(
        'not.have.text',
        `${screenName} booked the ${courseTitle} course.`
      )
    })
  }
  verifyNotReceiveWithDrawCourseWebNotificationBy(screenName, courseTitle) {
    const webNotification = new WebNotification()
    webNotification.clickOnWebNotificationIcon()
    webNotification.getTheLastNotificationItem()
    cy.get('@notificationItem').within(() => {
      cy.get('.notification-body').should(
        'not.have.text',
        `${screenName} withdrew from the ${courseTitle} course.`
      )
    })
  }
  withDrawCourseInstanceBy(courseTitle, scheduleDate, deliveryMethod) {
    const learning = new Learning()
    learning.visitLearningPage()
    learning.openViewMyCourseBy(courseTitle)
    learning.withDrawCourseInstanceBy(scheduleDate, deliveryMethod)
    learning.confirmWithDrawCourseInstance()
  }
  verifyNotReceiveCreateNewAnnouncementWebNotificationBy(announcementBody) {
    const webNotification = new WebNotification()
    webNotification.clickOnWebNotificationIcon()
    webNotification.selectAnnouncementsTab()
    cy.expectElementWithLabelNotExist(announcementBody)
  }
}

export default Notifications
