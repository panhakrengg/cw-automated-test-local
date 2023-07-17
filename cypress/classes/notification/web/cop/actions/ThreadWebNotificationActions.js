import Field from '../../../../constants/Field'
import DiscussionIntercepts from '../../../../discussion/intercepts/DiscussionIntercepts'
import WebNotificationsIntercepts from '../../base/intercepts/WebNotificationsIntercepts'
import ThreadWebNotificationQueries from '../queries/ThreadWebNotificationQueries'

class ThreadWebNotificationActions extends ThreadWebNotificationQueries {
  clickDiscussionNotification(desc) {
    DiscussionIntercepts.fetchThreadDetail.set()
    super.getDiscussionNotification(desc).click()
    DiscussionIntercepts.fetchThreadDetail.wait()
  }
}
export default ThreadWebNotificationActions
