import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import { InterceptActionRequest } from '../cop/cop-administration/admin/base-admin/InterceptActionRequest'
import DateFormat from '../format-collections/DateFormat'
import InstanceOverviewItc from '../lms-admin/course-instance/learner/intercepts/InstanceOverviewItc'
import UserAccountUtil from '../utilities/UserAccountUtil'
import WebNotificationConstant from './web/WebNotificationConstant'

class WebNotification {
  _itcFetchNotifications = new InterceptReq('/notifications/unread/count', 'FetchNotifications')
  _itcMarkNotificationRead = new InterceptReq('/notifications/mark_as_read', 'MarkNotificationRead')
  _itcRequestAccept = new InterceptReq('/request/accept', 'RequestAccept')
  _itcNotificationFetch = new InterceptReq('/notifications/fetch', 'NotificationFetch')
  _itcDeleteNotification = new InterceptReq('/notifications/delete', 'DeleteNotification')
  _itcGetAnnouncements = new InterceptReq('/announcements/get', 'GetAnnouncements')
  clickOnWebNotificationIcon() {
    cy.get('#web-notification-dropdown')
      .parent()
      .within(() => {
        this._itcFetchNotifications.set()
        cy.get('.cw-icon-connection').click()
        this._itcFetchNotifications.wait()
      })
  }
  show() {
    cy.get('#web-notification-dropdown')
      .parent()
      .within(() => {
        cy.get('.panel-notifications-count').should('be.visible')
        this._itcFetchNotifications.set()
        cy.get('.cw-icon-connection').click()
        this._itcFetchNotifications.wait()
      })
  }
  seeEmptyNotifications(text) {
    cy.contains(text)
  }
  seeAddNewPost(userName, copName, post) {
    cy.get('#web-notification-container > .cec-card > .cec-card__body').within(
      ($webNotification) => {
        cy.wrap($webNotification)
          .get('.title')
          .contains(`${userName} added a new post in ${copName}`)
        cy.wrap($webNotification).get('.badge').contains('Post')
        cy.wrap($webNotification).get('.badge-description').contains(post.title)
      }
    )
  }

  seeAssignAsTeamLeader(userName, orgName, clickParent = false) {
    cy.get('#web-notification-container > .cec-card > .cec-card__body').within(
      ($webNotification) => {
        cy.wrap($webNotification)
          .get('.notification-body')
          .contains(`${userName} added you as a team leader in ${orgName}`)
          .parents('.notification')
          .as('notification')
        cy.get('@notification').within(($content) => {
          cy.wrap($content).getThreeDots().as('dropdown')
        })
        cy.get('@dropdown').within(($dropdown) => {
          cy.wrap($dropdown).find('a[data-toggle="dropdown"]').click()
          this._itcMarkNotificationRead.set()
          cy.wrap($dropdown).clickDropdownName('Mark as Read')
          this._itcMarkNotificationRead.wait()
        })
        if (clickParent) cy.get('@notification').children('.cursor-pointer:first').click()
      }
    )
  }

  clickOnPost(title) {
    cy.get('#web-notification-container > .cec-card > .cec-card__body').within(
      ($webNotification) => {
        cy.wrap($webNotification).contains(title).click()
      }
    )
  }

  clickLikePost() {
    cy.get('#web-notification-container > .cec-card > .cec-card__body').within(
      ($webNotification) => {
        cy.wrap($webNotification)
          .get('.title')
          .contains(`${userName} liked your post in ${copName}`)
          .click()
      }
    )
  }

  clickCommentPost() {
    cy.get('#web-notification-container > .cec-card > .cec-card__body').within(
      ($webNotification) => {
        cy.wrap($webNotification)
          .get('.title')
          .contains(`${userName} commented on a post in ${copName}`)
          .click()
      }
    )
  }

  checkLikePost(userName, copName, post) {
    cy.get('#web-notification-container > .cec-card > .cec-card__body').within(
      ($webNotification) => {
        cy.wrap($webNotification)
          .get('.title')
          .contains(`${userName} liked your post in ${copName}`)
        cy.wrap($webNotification).get('.badge').contains('Post')
        cy.wrap($webNotification).get('.badge-description').contains(post.title)
      }
    )
  }
  checkCommentPost(userName, copName, post) {
    cy.get('#web-notification-container > .cec-card > .cec-card__body').within(
      ($webNotification) => {
        cy.wrap($webNotification)
          .get('.title')
          .contains(`${userName} commented on a post in ${copName}`)
        cy.wrap($webNotification).get('.badge').contains('Post')
        cy.wrap($webNotification).get('.badge-description').contains(post.title)
      }
    )
  }
  acceptOrgInvitation(userName, orgName) {
    this.acceptRequest(`${userName} would like to add you into ${orgName} organization.`)
  }
  acceptRequest(title) {
    this.show()
    this.selectRequestsTab()
    cy.get('.title').contains(title).parents('.notification').as('notification')
    this._itcRequestAccept.set()
    cy.get('@notification').contains('button', 'Accept').click()
    this._itcRequestAccept.wait()
  }
  selectRequestsTab() {
    cy.get('#web-notification-container').within(() => cy.cecCard().as('cecCard'))
    this._itcNotificationFetch.set()
    cy.get('@cecCard').find('div.tab-menu-wrapper > .tab-menu').contains('Requests').click()
    this._itcNotificationFetch.wait()
  }
  selectAnnouncementsTab() {
    cy.get('#web-notification-container').within(() => cy.cecCard().as('cecCard'))
    this._itcGetAnnouncements.set()
    cy.get('@cecCard').find('div.tab-menu-wrapper > .tab-menu').contains('Announcements').click()
    this._itcGetAnnouncements.wait()
  }
  expectToSeeModifyCourseInfo(userName, courseTitle, isNew) {
    this.show()
    this.getNotificationItem(
      `${userName} ${!isNew ? 'updated' : 'created'} the course ${courseTitle}.`
    ).within(($notification) => {
      cy.contains('span.badge', 'Learning').should('be.visible')
      cy.wrap($notification).click()
    })
  }
  expectToSeeInviteToJoinOrganization() {
    this.getNotificationItem(WebNotificationConstant.INVITE_TO_JOIN_ORGANIZATION).should(
      'be.visible'
    )
  }
  denyToJoinOrganization() {
    this._itcRequestAccept.set()
    this.getNotificationItem(WebNotificationConstant.INVITE_TO_JOIN_ORGANIZATION)
      .find('button')
      .contains('Deny')
      .click()
    this._itcRequestAccept.wait()
  }
  markAsRead($notification) {
    cy.wrap($notification).within(() => {
      this._itcMarkNotificationRead.set()
      cy.getThreeDots().find('a[data-toggle="dropdown"]').click().clickDropdownName('Mark as Read')
      this._itcMarkNotificationRead.wait()
    })
  }
  getNotificationItem(title) {
    cy.get('#web-notification-container').within(($container) => {
      cy.wrap($container)
        .get('.notification-body')
        .contains(title)
        .parents('.notification')
        .scrollIntoView()
        .as('notificationItem')
    })
    return cy.get('@notificationItem')
  }
  getTheLastNotificationItem() {
    cy.get('#web-notification-container').within(($container) => {
      cy.wrap($container).get('.notification').first().as('notificationItem')
    })
    return cy.get('@notificationItem')
  }
  getNotificationBy(subject) {
    this.getNotificationItem(subject)
      .first()
      .then(($notification) => {
        cy.wrap($notification).as('notificationItem')
      })
    return cy.get('@notificationItem')
  }
  verifyTitleContainContent(content) {
    cy.get('@notificationItem').within(() => {
      cy.get('.title').should('have.text', content)
    })
  }
  verifyBodyContainContent(content) {
    cy.get('@notificationItem').within(() => {
      cy.get('.notification-body').should('have.text', content)
    })
  }
  verifyDescriptionContainContent(content) {
    cy.get('@notificationItem').within(() => {
      cy.get('.body .badge-description').should('have.text', content)
    })
  }
  verifyHasBadge(badge) {
    cy.get('@notificationItem').within(() => {
      cy.get('.body .badge').should('have.text', badge)
    })
  }

  denyConnectionRequest(userName, note) {
    cy.get('#web-notification-container .notification')
      .first()
      .within(() => {
        cy.contains('.title > strong', userName).should('be.visible')
        cy.contains('.body', `Message: '${note}'`).should('be.visible')
        cy.contains('button', 'Deny').should('be.visible').click()
      })
    cy.get(
      `#web-notification-container .notification .title > strong:contains(${userName})`
    ).should('not.exist')
  }
  approveConnectionRequest(userName, note) {
    cy.get('#web-notification-container .notification')
      .first()
      .within(() => {
        cy.contains('.title > strong', userName).should('be.visible')
        cy.contains('.body', `Message: '${note}'`).should('be.visible')
        cy.contains('button', 'Accept').should('be.visible').click()
      })
    cy.get(
      `#web-notification-container .notification .title > strong:contains(${userName})`
    ).should('not.exist')
  }
  noConnectionRequestExist(userName) {
    cy.get(
      `#web-notification-container .notification .title > strong:contains("${userName}")`
    ).should('not.exist')
  }
  getNotificationOfUpdatedAnInstanceInTheCourse(userName, courseName) {
    this.show()
    return this.getNotificationItem(`${userName} updated an instance in the course ${courseName}.`)
  }
  getNotificationOfBookingACourse(userName, courseName) {
    this.show()
    return this.getNotificationItem(`${userName} booked the ${courseName} course.`)
  }
  denyToJoinCommunity() {
    this.show()
    this.selectRequestsTab()
    this._itcRequestAccept.set()
    cy.get('#web-notification-container').within(() => {
      cy.getElementWithLabel(WebNotificationConstant.REQUEST_TO_ACCESS, '.notification-body')
        .parents('.notification')
        .find('button')
        .contains('Deny')
        .click()
    })
    this._itcRequestAccept.wait()
  }
  getNotificationOfUpdateCourse(userName, courseName) {
    this.show()
    return this.getNotificationItem(`${userName} updated the course ${courseName}.`)
  }

  getNotificationOfCreateAnInstanceInTheCourse(userName, courseName) {
    this.show()
    return this.getNotificationItem(`${userName} created an instance in the course ${courseName}.`)
  }

  deleteTheLastNotificationItem() {
    this._itcDeleteNotification.set()
    cy.get('@notificationItem').within(($item) => {
      cy.wrap($item).getThreeDots().find('a[data-toggle="dropdown"]').click()
      cy.get('@cwThreeDots').clickDropdownName(Field.DELETE)
    })
    this._itcDeleteNotification.wait()
  }

  clickOnNotificationItem() {
    cy.get(`@notificationItem`).within(() => {
      cy.get('.cursor-pointer').click()
    })
  }
  notReceiveNotification(content) {
    this.getTheLastNotificationItem().within(($notification) => {
      expect($notification.find(`.badge-description:contains("${content}")`)).to.have.length(0)
    })
  }
  getTotalUnreadRequest() {
    cy.get('@itcNotificationUnreadCount').then((res) => {
      const { success, result } = res.response.body
      if (!success) return
      cy.wrap(result.unreadRequestCount).as('totalUnreadRequest')
    })
    return cy.get('@totalUnreadRequest')
  }

  #clickButtonAccept(body) {
    this._itcRequestAccept.set()
    this.getNotificationItem(body).within(() => {
      cy.clickButtonByName('Accept')
      cy.getButtonByName('Deny').isDisabled()
      cy.getButtonByName('Accept').isDisabled()
    })
    this._itcRequestAccept.wait()
    cy.wait(3000)
  }

  acceptRequestToJoinCopByNotificationBody(body) {
    InterceptActionRequest.itcNotificationUnreadCount.set()
    this.show()
    this.selectRequestsTab()
    InterceptActionRequest.itcNotificationUnreadCount.wait()
    this.getTotalUnreadRequest().then((oldValue) => {
      this.#clickButtonAccept(body)
      this.getTotalUnreadRequest().then((newValue) => {
        expect(newValue).to.equal(oldValue - 1)
      })
    })
  }
  noWebNotificationExistWithTitle(title) {
    cy.get('#web-notification-container .notification')
      .first()
      .within(() => {
        cy.get('.title').should('not.have.text', title)
      })
  }
  #getCourseAnnouncementNotification(courseName) {
    return cy.getElementWithLabel(courseName, '.notification')
  }

  clickCourseAnnouncement(courseName) {
    InstanceOverviewItc.activitiesCourseCatalog.set()
    this.#getCourseAnnouncementNotification(courseName).click()
    InstanceOverviewItc.activitiesCourseCatalog.wait()
  }

  verifyReceiveCourseAnnouncement(courseName, announcementBody) {
    const userAccountUtil = new UserAccountUtil()
    const date = userAccountUtil.getDateByDefaultTimeZoneAndFormat(
      DateFormat.ANNOUNCEMENT_EXPIRY_DATE
    )

    this.clickOnWebNotificationIcon()
    this.selectAnnouncementsTab()
    this.#getCourseAnnouncementNotification(courseName)
      .first()
      .within(($item) => {
        cy.wrap($item).expectElementWithLabelVisible(date, '.font-size-12')
        cy.wrap($item).expectElementWithLabelVisible(
          `New Announcement in the ${courseName} course`,
          'span'
        )
        cy.wrap($item).expectElementWithLabelVisible(announcementBody, '.font-size-14')
      })
  }
  containNotificationRequest(body) {
    InterceptActionRequest.itcNotificationUnreadCount.set()
    this.show()
    this.selectRequestsTab()
    InterceptActionRequest.itcNotificationUnreadCount.wait()
    this.getNotificationItem(body).should('be.visible')
  }
}

export default WebNotification
