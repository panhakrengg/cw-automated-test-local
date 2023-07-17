class WebNotificationTemplates {
  #badges = {
    discussion: 'Discussion',
  }

  _getBadge(name) {
    return this.#badges[name]
  }

  _getUserPostNewThreadTemplate(username, courseTitle) {
    return `${username} posted a new thread in ${courseTitle} course.`
  }

  _getPersonReactedToYourThread(courseTitle) {
    return `1 person reacted to your thread in the ${courseTitle} course.`
  }

  _getSingleRepliedThread(username, courseTitle) {
    return `${username} replied to a thread in the ${courseTitle} course.`
  }

  _getMultiRepliedThread(username1, username2, courseTitle) {
    return `${username1} and ${username2} replied to a thread in the ${courseTitle} course.`
  }

  _getUserCreateNewCategoryTemplate(username, courseTitle) {
    return `${username} created a new category in the ${courseTitle} course.`
  }
}

export default WebNotificationTemplates
