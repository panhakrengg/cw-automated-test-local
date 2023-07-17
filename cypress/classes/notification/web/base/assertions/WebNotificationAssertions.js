import WebNotificationQueries from '../queries/WebNotificationQueries'

class WebNotificationAssertions extends WebNotificationQueries {
  expectNotToSeeNotification(body) {
    super
      .getNotificationsCardBody()
      .within(($body) => expect($body.find(`:contains("${body}")`).length).to.eq(0))
  }
}

export default WebNotificationAssertions
