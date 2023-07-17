import WebNotificationAssertions from '../../base/assertions/WebNotificationAssertions'
import { BadgeLabel } from '../../base/constant/WebNotificationConstant'
import WebNotificationQueries from '../../base/queries/WebNotificationQueries'
import ThreadWebNotificationQueries from '../queries/ThreadWebNotificationQueries'
import ThreadWebNotificationTemplates from '../templates/ThreadWebNotificationTemplates'

class ThreadWebNotificationAssertions extends WebNotificationAssertions {
  #threadWebNotificationQueries = new ThreadWebNotificationQueries()
  #webNotificationQueries = new WebNotificationQueries()
  #threadTemplates = new ThreadWebNotificationTemplates()

  expectToSeeCoPPostedNewThreadNotification(author, copName, threadSubject) {
    this.#threadWebNotificationQueries.getDiscussionNotification(threadSubject).within(() => {
      cy.expectElementWithLabelVisible(
        this.#threadTemplates.getUserPostNewThreadTemplate(author, copName)
      )
      this.#webNotificationQueries.getBadge().should('have.text', BadgeLabel.DISCUSSION)
      this.#webNotificationQueries.getBadgeDescription().should('have.text', threadSubject)
    })
  }

  expectToSeeCreatedNewCategoryNotification(author, copName, categoryName) {
    this.#threadWebNotificationQueries.getDiscussionNotification(categoryName).within(() => {
      cy.expectElementWithLabelVisible(
        this.#threadTemplates.getUserCreateNewCategoryTemplate(author, copName)
      )
      this.#webNotificationQueries.getBadge().should('have.text', BadgeLabel.DISCUSSION)
      this.#webNotificationQueries.getBadgeDescription().should('have.text', categoryName)
    })
  }

  expectToSee1PersonReactThreadNotification(totalReact, copName, threadSubject) {
    this.#threadWebNotificationQueries.getDiscussionNotification(threadSubject).within(() => {
      cy.expectElementWithLabelVisible(
        this.#threadTemplates.getReactThreadTemplate(totalReact, copName)
      )
      this.#webNotificationQueries.getBadge().should('have.text', BadgeLabel.DISCUSSION)
      this.#webNotificationQueries.getBadgeDescription().should('have.text', threadSubject)
    })
  }

  expectToSeeReactCommentNotification(totalReact, copName, threadSubject) {
    this.#threadWebNotificationQueries.getDiscussionNotification(threadSubject).within(() => {
      cy.expectElementWithLabelVisible(
        this.#threadTemplates.getReactCommentTemplate(totalReact, copName)
      )
      this.#webNotificationQueries.getBadge().should('have.text', BadgeLabel.DISCUSSION)
      this.#webNotificationQueries.getBadgeDescription().should('have.text', threadSubject)
    })
  }

  expectToSee1PersonReplyToThreadNotification(author, copName, threadSubject) {
    this.#threadWebNotificationQueries.getDiscussionNotification(threadSubject).within(() => {
      cy.expectElementWithLabelVisible(
        this.#threadTemplates.get1PersonReplyToThreadTemplate(author, copName)
      )
      this.#webNotificationQueries.getBadge().should('have.text', BadgeLabel.DISCUSSION)
      this.#webNotificationQueries.getBadgeDescription().should('have.text', threadSubject)
    })
  }

  expectToSee2PeopleReplyToThreadNotification(user1, user2, copName, threadSubject) {
    this.#threadWebNotificationQueries.getDiscussionNotification(threadSubject).within(() => {
      cy.expectElementWithLabelVisible(
        this.#threadTemplates.get2PeopleReplyToThreadTemplate(user1, user2, copName)
      )
      this.#webNotificationQueries.getBadge().should('have.text', BadgeLabel.DISCUSSION)
      this.#webNotificationQueries.getBadgeDescription().should('have.text', threadSubject)
    })
  }
}
export default ThreadWebNotificationAssertions
