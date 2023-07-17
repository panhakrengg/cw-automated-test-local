import Field from '../../../constants/Field'
import PostIntercept from '../intercepts/PostIntercept'
import PostQuery from '../queries/PostQuery'

export default class PostAction extends PostQuery {
  visitCopHomeByUrl(url) {
    PostIntercept.itcGetProfileComment.set()
    cy.visit(url)
    PostIntercept.itcGetProfileComment.wait()
  }

  #clickQuickPostThreeDotItem(content, item) {
    super
      .getQuickPostByContent(content)
      .first()
      .within(() => {
        cy.getThreeDots().click()
        cy.get('@cwThreeDots').clickDropdownName(item)
      })
  }

  deleteQuickPostByContent(content) {
    PostIntercept.itcGetProfileComment.set()
    PostIntercept.itcFetchPosts.set()
    this.#clickQuickPostThreeDotItem(content, Field.DELETE)
    cy.swal2().swal2Confirm(Field.YES_REMOVE).click()
    cy.waitUntilIconLoadingLgIsVisible()
    PostIntercept.itcFetchPosts.wait()
    PostIntercept.itcGetProfileComment.wait()
    cy.waitUntilIconLoadingLgNotExist()
  }

  deleteQuickPostsByContentIfExist(content) {
    super.getTotalQuickPostWithContent(content).then(($total) => {
      if ($total) {
        for (let i = 0; i < $total; i++) {
          this.deleteQuickPostByContent(content)
        }
      }
    })
  }

  clickOnQuickPostToPostDetails(content) {
    cy.getElementWithLabel(content, 'article')
      .first()
      .within(($article) => {
        PostIntercept.itcFetchRecentPosts.set()
        cy.wrap($article).get('i:contains("More...")').parent().click()
        PostIntercept.itcFetchRecentPosts.wait()
      })
  }

  #clickShareIcon() {
    super.getIconShare().click()
  }

  #clickCommentIcon() {
    super.getIconComment().click()
    cy.wait(2000)
  }

  #selectCommunityAndShare(shareInfo, selectThisCoP = false) {
    const { to, shareYourThoughts } = shareInfo
    cy.swal2().within(($swal2) => {
      PostIntercept.itcFetchVisibilityOptions.set()
      if (selectThisCoP) {
        cy.get('.cop-item .this-cop').siblings('.cursor-pointer').click()
      } else {
        cy.getElementWithLabel(to, 'span').parents('label.cursor-pointer').click()
      }
      cy.clickPrimaryButton(Field.NEXT)
      PostIntercept.itcFetchVisibilityOptions.wait()
      PostIntercept.itcGetProfileComment.set()
      cy.wrap($swal2).getMultiSelect().click()
      cy.wrap($swal2).multiSelectByName(shareInfo.visibility)
      cy.typeInTextareaByPlaceholder(Field.SHARE_YOUR_THOUGHT, shareYourThoughts)
      cy.clickPrimaryButton(Field.POST)
      PostIntercept.itcGetProfileComment.wait()
    })
  }

  sharePostInPostDetail(content, shareInfo, selectThisCoP = false) {
    this.clickOnQuickPostToPostDetails(content)
    this.#clickShareIcon()
    this.#selectCommunityAndShare(shareInfo, selectThisCoP)
  }

  sharePostInHome(content, shareInfo, selectThisCoP = false) {
    super.getQuickPostByContent(content).within(() => {
      this.#clickShareIcon()
    })
    this.#selectCommunityAndShare(shareInfo, selectThisCoP)
  }

  #deleteComment(comment) {
    cy.get(`p:contains("${comment}")`)
      .first()
      .parents('.cec-list-group__headline')
      .within(() => {
        cy.getThreeDots().click()
        cy.get('@cwThreeDots').clickDropdownName(Field.DELETE)
      })
    cy.swal2().swal2Confirm(Field.YES_REMOVE).click()
  }

  removeCommentIfExist(comment) {
    super.getCommentWrapper().then(($body) => {
      const total = $body.find(`p:contains("${comment}")`).length
      if (total) {
        for (let i = 0; i < total; i++) {
          this.#deleteComment(comment)
        }
      }
    })
  }

  removeCommentFromPostIfExistInHome(desc, comment) {
    super.getQuickPostByContent(desc).within(() => {
      this.#clickCommentIcon()
    })
    this.removeCommentIfExist(comment)
  }

  addComment(comment) {
    super.getCommentWrapper().within(() => {
      PostIntercept.itcAddComment.set()
      cy.typeInTextareaByPlaceholder('Add comment', comment)
      super.getButtonAddComment().click()
      PostIntercept.itcAddComment.wait()
    })
  }
}
