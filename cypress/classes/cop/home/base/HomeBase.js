import WebNotificationActions from '../../../notification/web/base/actions/WebNotificationActions'
import LoginToHomeAs from '../../mock/login/LoginToHomeAs'
import PostingAndSharingYaml from '../../mock/notification-share-post/PostingAndSharingYaml'
import PostAction from '../actions/PostAction'
import PostAssertion from '../assertions/PostAssertion'

export default class HomeBase {
  constructor() {
    this.login = new LoginToHomeAs()
    this.yaml = new PostingAndSharingYaml()
    this.postAction = new PostAction()
    this.postAssertion = new PostAssertion()
    this.webAction = new WebNotificationActions()
  }
}
