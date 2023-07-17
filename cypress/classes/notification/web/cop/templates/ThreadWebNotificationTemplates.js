class ThreadWebNotificationTemplates {
  #getTotalReactLabel(totalReact) {
    return totalReact == 1 ? '1 person' : `${totalReact} people`
  }

  getUserPostNewThreadTemplate(username, copName) {
    return `${username} posted a new thread in ${copName}.`
  }

  getUserCreateNewCategoryTemplate(username, copName) {
    return `${username} created a new category in ${copName}.`
  }

  getReactThreadTemplate(totalReact, copName) {
    return `${this.#getTotalReactLabel(totalReact)} reacted to your thread in ${copName}.`
  }

  getReactCommentTemplate(totalReact, copName) {
    return `${this.#getTotalReactLabel(
      totalReact
    )} reacted to your comment in the thread in ${copName}.`
  }

  get1PersonReplyToThreadTemplate(username, copName) {
    return `${username} replied to a thread in ${copName}.`
  }

  get2PeopleReplyToThreadTemplate(user1, user2, copName) {
    return `${user1} and ${user2} replied to a thread in ${copName}.`
  }
}
export default ThreadWebNotificationTemplates
