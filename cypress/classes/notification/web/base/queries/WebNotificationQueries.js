import { TabMenuLabel } from '../constant/WebNotificationConstant'

class WebNotificationQueries {
  getIconNotification() {
    return cy.get('a[title="Notifications"]')
  }

  #getNotificationsTab() {
    return cy.getElementWithLabel(TabMenuLabel.NOTIFICATIONS, '.tab-menu')
  }

  getBadge() {
    return cy.get('.badge')
  }

  getBadgeDescription() {
    return cy.get('.badge-description')
  }

  getNotificationItemByBadgeDescription(badgeDesc) {
    return cy.getElementWithLabel(badgeDesc, '.badge-description').parents('.notification')
  }

  getTotalFromNotificationIcon() {
    cy.wait(1000)
    cy.get('.panel-notifications-count')
      .invoke('text')
      .then((total) => {
        cy.wrap(parseInt(total)).as('totalFromNotificationIcon')
      })
    return cy.get('@totalFromNotificationIcon')
  }

  getTotalFromNotificationsTab() {
    this.#getNotificationsTab()
      .find('i')
      .invoke('text')
      .then((total) => {
        const t = total.replace('(', '').replace(')', '')
        cy.wrap(parseInt(t)).as('totalFromNotificationsTab')
      })
    return cy.get('@totalFromNotificationsTab')
  }

  getNotificationsCardBody() {
    cy.waitIconLoadingNotExist()
    return cy.get('.scroll-content-area')
  }

  getLatestNotificationItem() {
    cy.get('#web-notification-container').within(($container) => {
      cy.wrap($container).get('.notification').first().as('notificationItem')
    })
    return cy.get('@notificationItem')
  }
}
export default WebNotificationQueries
