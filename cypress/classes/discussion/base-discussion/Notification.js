import WebNotificationTemplates from '../../notification/web/WebNotificationTemplates'
import WebNotification from '../../notification/WebNotification'

class Notification {
  #webNotification = new WebNotification()
  #webNotificationTemplates = new WebNotificationTemplates()

  #verifyNotificationBody(title, subject) {
    const badge = this.#webNotificationTemplates._getBadge('discussion')
    this.#webNotification.verifyHasBadge(badge)
    this.#webNotification.verifyTitleContainContent(title)
    this.#webNotification.verifyDescriptionContainContent(subject)
  }

  #verifyNotificationBySubject(title, subject) {
    this.#webNotification.getNotificationBy(subject)
    this.#verifyNotificationBody(title, subject)
  }

  #verifyNotificationByTitle(title, subject) {
    this.#webNotification.getNotificationItem(title)
    this.#verifyNotificationBody(title, subject)
  }

  verifyUserReceiveWebNotificationForThreadReaction(course, subject) {
    const title = this.#webNotificationTemplates._getPersonReactedToYourThread(course.name)
    this.#verifyNotificationBySubject(title, subject)
  }

  verifyUserCreateNewThreadWebNotification(username, courseTitle, threadSubject) {
    const title = this.#webNotificationTemplates._getUserPostNewThreadTemplate(
      username,
      courseTitle
    )
    this.#verifyNotificationByTitle(title, threadSubject)
    this.#webNotification.deleteTheLastNotificationItem()
  }
  verifyUserDoNotGetNewThreadWebNotification(username, courseTitle) {
    const content = this.#webNotificationTemplates._getUserPostNewThreadTemplate(
      username,
      courseTitle
    )
    this.#webNotification.noWebNotificationExistWithTitle(content)
  }

  verifyRepliedThreadNotificationBySinglePerson(username, courseTitle, threadSubject) {
    const title = this.#webNotificationTemplates._getSingleRepliedThread(username, courseTitle)
    this.#verifyNotificationByTitle(title, threadSubject)
  }

  verifyRepliedThreadNotificationByMultiPeople(username1, username2, courseTitle, threadSubject) {
    const title = this.#webNotificationTemplates._getMultiRepliedThread(
      username1,
      username2,
      courseTitle
    )
    this.#verifyNotificationByTitle(title, threadSubject)
  }
  verifyUserCreateNewCategoryWebNotification(username, courseTitle, threadSubject) {
    const title = this.#webNotificationTemplates._getUserCreateNewCategoryTemplate(
      username,
      courseTitle
    )
    this.#verifyNotificationByTitle(title, threadSubject)
  }
}

export default Notification
