import Field from '../../../../constants/Field'
import WebNotificationsIntercepts from '../intercepts/WebNotificationsIntercepts'
import WebNotificationQueries from '../queries/WebNotificationQueries'

class WebNotificationActions extends WebNotificationQueries {
  clickIconNotification() {
    WebNotificationsIntercepts.fetchNotifications.set()
    super.getIconNotification().click()
    WebNotificationsIntercepts.fetchNotifications.wait()
  }

  removeNotificationByBadgeDesc(desc) {
    WebNotificationsIntercepts.countUnreadNotifications.set()
    super
      .getNotificationItemByBadgeDescription(desc)
      .first()
      .within(($item) => {
        cy.wrap($item).getThreeDots().find('a').first().click()
        cy.wrap($item).clickDropdownName(Field.DELETE)
      })
    WebNotificationsIntercepts.deleteNotifications.set()
    WebNotificationsIntercepts.countUnreadNotifications.wait()
  }

  removeNotificationsByBadgeDesc(desc) {
    super.getNotificationsCardBody().then(($contentArea) => {
      const total = $contentArea.find(`.badge-description:contains('${desc}')`).length
      if (total) {
        for (let i = 0; i < total; i++) {
          this.removeNotificationByBadgeDesc(desc)
        }
      }
    })
  }

  clickThenRemoveNotificationByBadgeDesc(desc) {
    this.clickIconNotification()
    this.removeNotificationByBadgeDesc(desc)
  }

  clickLatestNotificationItem() {
    super.getLatestNotificationItem().click()
  }

  clickNotificationByDesc(desc) {
    super.getNotificationItemByBadgeDescription(desc).first().find('.cursor-pointer').click()
  }

  clickIconThenRemoveNotification(desc) {
    this.clickIconNotification()
    this.removeNotificationsByBadgeDesc(desc)
  }
}
export default WebNotificationActions
