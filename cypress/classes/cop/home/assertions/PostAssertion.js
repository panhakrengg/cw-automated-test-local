import Field from '../../../constants/Field'
import WebNotificationActions from '../../../notification/web/base/actions/WebNotificationActions'
import WebNotificationQueries from '../../../notification/web/base/queries/WebNotificationQueries'
import PostQuery from '../queries/PostQuery'

export default class PostAssertion extends PostQuery {
  #webNotificationQueries = new WebNotificationQueries()
  #webNotificationActions = new WebNotificationActions()

  #sharePostTitle = 'shared your post in'
  #commentPostTitle = 'commented on a post in'

  expectToSeePostDetailPage(content, copUrl = '') {
    cy.url().should('include', `${copUrl}/post-detail`)
    cy.get('.post-content-wrapper').should('contain.text', content)
  }

  expectToSeeComment(comment) {
    super.getCommentWrapper().within(() => {
      cy.expectElementWithLabelVisible(comment, 'p')
    })
  }

  expectPostNotificationRedirectToPostDetail(post) {
    const { title, truncateTitle } = post
    this.#webNotificationActions.clickIconNotification()
    this.#webNotificationActions.clickNotificationByDesc(truncateTitle ? truncateTitle : title)
    this.expectToSeePostDetailPage(title)
  }

  verifyPostNotificationRedirectToPostDetailAndContainComments(post, ...comments) {
    this.expectPostNotificationRedirectToPostDetail(post)
    comments.forEach((comment) => {
      this.expectToSeeComment(comment)
    })
  }

  #expectToReceivePostNotification(userName, copName, desc, title) {
    this.#webNotificationQueries
      .getNotificationItemByBadgeDescription(desc)
      .first()
      .scrollIntoView()
      .within(($notify) => {
        cy.wrap($notify).expectElementWithLabelVisible(`${userName} ${title} ${copName}.`, '.title')
        cy.wrap($notify).expectElementWithLabelVisible(Field.POST, '.badge')
        cy.wrap($notify).expectElementWithLabelVisible(desc, '.badge-description')
      })
  }

  expectToReceiveCommentPostNotificationAndRemove(userName, copName, desc) {
    this.#webNotificationActions.clickIconNotification()
    this.#expectToReceivePostNotification(userName, copName, desc, this.#commentPostTitle)
    this.#webNotificationActions.removeNotificationsByBadgeDesc(desc)
  }

  expectToReceiveSharePostNotificationAndRemove(userName, copName, desc) {
    this.#webNotificationActions.clickIconNotification()
    this.#expectToReceivePostNotification(userName, copName, desc, this.#sharePostTitle)
    this.#webNotificationActions.removeNotificationsByBadgeDesc(desc)
  }

  expectNotToReceiveNotification(desc) {
    this.#webNotificationActions.clickIconNotification()
    this.#webNotificationQueries.getNotificationsCardBody().within(($body) => {
      expect($body.find(`.badge-description:contains("${desc}")`).length).to.eq(0)
    })
  }
}
