import Discussion from '../../constants/Discussion'
import DateFormat from '../../format-collections/DateFormat'
import UserAccountUtil from '../../utilities/UserAccountUtil'
import InterceptDiscussion from './InterceptDiscussion'

class ThreadDetails {
  votes = {
    like: 1,
    dislike: 2,
  }

  /* Query */
  #getReplyButton() {
    return cy.getElementWithLabel('Reply', 'button')
  }

  #getReactIcon(index) {
    this.#getReplyButton()
      .first()
      .parent()
      .within(() => {
        cy.get(`a:nth-child(${index})`).as('reactIcon')
      })
    return cy.get('@reactIcon')
  }

  getTotalReaction(index) {
    this.#getReactIcon(index).within(($reactIcon) => {
      cy.wrap($reactIcon)
        .get('span')
        .invoke('text')
        .then(($react) => {
          cy.wrap($react).as('totalViewReact')
        })
    })
    return cy.get('@totalViewReact')
  }

  #getThreadWrapper() {
    return cy.get('.thread-wrapper')
  }

  getReplyBy(comment) {
    return cy.getElementWithLabel(comment, '.description').parent()
  }

  /* Actions */
  clickBackIcon() {
    InterceptDiscussion.itcFetchRecentThreads.set()
    cy.getElementWithLabel(Discussion.BACK, 'span').parent().click()
    InterceptDiscussion.itcFetchRecentThreads.wait()
  }

  #clickReactIcon(index) {
    InterceptDiscussion.itcUpdateVote.set()
    this.#getReactIcon(index).click()
    InterceptDiscussion.itcUpdateVote.wait()
  }

  clickLike() {
    this.#clickReactIcon(this.votes.like)
  }

  clickDislike() {
    this.#clickReactIcon(this.votes.dislike)
  }

  _clickReplyThreadButton() {
    this.#getReplyButton().first().click({ force: true })
  }

  clickReplyCommentButton() {
    InterceptDiscussion.itcFetchEditorConfig.set()
    this._clickReplyThreadButton()
    InterceptDiscussion.itcFetchEditorConfig.wait()
  }

  /* Assertions */
  verifyThreadThreeDotOptions(options = []) {
    cy.get('.thread-wrapper')
      .first()
      .within(() => {
        options.forEach((option) => {
          cy.getDropdownList().find(`a:contains(${option})`).should('be.exist')
        })
      })
  }

  #expectEditedTooltip() {
    const currentDate = new UserAccountUtil().getDateByDefaultTimeZoneAndFormat(
      DateFormat.THREAD_MODIFIED_DATE_FORMAT
    )
    cy.getElementWithLabel('Edited', '.cw-tooltip-wrapper')
      .find('.tooltip-body')
      .invoke('css', 'visibility', 'visible')
      .realHover()
    cy.expectElementWithLabelVisible(`Edited ${currentDate} by`)
  }

  verifyThreadDetails(thread, isNew = true) {
    this.#getThreadWrapper()
      .first()
      .within(() => {
        if (isNew) cy.expectElementWithLabelVisible('About a minute ago.', '.card-item')
        else this.#expectEditedTooltip()
        cy.get('a.subject').should('contain.text', thread.subject)
        cy.get('.view-tag').should('contain.text', `posted in${thread.category.name}`)
        if (thread.detail) {
          cy.get('.description').should('contain.text', thread.detail)
        }
        if (thread.attachmentsName) {
          thread.attachmentsName.forEach((attachment) => {
            cy.get('.list-attachment').should('contain.text', attachment)
          })
        }
        if (thread.tags) {
          thread.tags.forEach((tag) => {
            cy.get('.badge').should('contain.text', tag)
          })
        }
      })
  }

  verifyDislikeIsIncrease(oldTotalDislike) {
    this.getTotalReaction(this.votes.dislike).then(($newTotalDislike) => {
      expect(parseInt($newTotalDislike)).to.be.equal(parseInt(oldTotalDislike) + 1)
    })
  }

  verifyCommentIsExistInThread(description, username) {
    cy.getElementWithLabel(description, '.thread-wrapper .description')
      .first()
      .should('be.visible')
      .as('threadDetail')
    cy.get('@threadDetail')
      .parent()
      .within(() => cy.expectElementWithLabelVisible(username, '.font-weight-bold'))
  }
}

export default ThreadDetails
