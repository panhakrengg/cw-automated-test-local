import WebNotificationQueries from '../../base/queries/WebNotificationQueries'

class ThreadWebNotificationQueries extends WebNotificationQueries {
  getDiscussionNotification(badgeDesc) {
    return this.getNotificationItemByBadgeDescription(badgeDesc).first().scrollIntoView()
  }
}
export default ThreadWebNotificationQueries
