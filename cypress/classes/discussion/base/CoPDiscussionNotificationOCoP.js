import CoPDiscussionNotificationYaml from '../../cop/mock/cop-discussion-notification-ocop/CoPDiscussionNotificationYaml'
import LoginToDiscussionAs from '../../cop/mock/login/LoginToDiscussionAs'
import WebNotificationActions from '../../notification/web/base/actions/WebNotificationActions'
import WebNotificationQueries from '../../notification/web/base/queries/WebNotificationQueries'
import ThreadWebNotificationActions from '../../notification/web/cop/actions/ThreadWebNotificationActions'
import ThreadWebNotificationAssertions from '../../notification/web/cop/assertions/ThreadWebNotificationAssertions'
import DiscussionActions from '../actions/DiscussionActions'
import DiscussionAssertions from '../assertions/DiscussionAssertions'

class CoPDiscussionNotificationOCoP {
  constructor() {
    this.actionDiscussion = new DiscussionActions()
    this.actionNotification = new WebNotificationActions()
    this.actionThreadNotification = new ThreadWebNotificationActions()
    this.assertionDiscussion = new DiscussionAssertions()
    this.assertionThreadNotification = new ThreadWebNotificationAssertions()
    this.login = new LoginToDiscussionAs()
    this.queryNotification = new WebNotificationQueries()
    this.yaml = new CoPDiscussionNotificationYaml()
  }
}

export default CoPDiscussionNotificationOCoP
