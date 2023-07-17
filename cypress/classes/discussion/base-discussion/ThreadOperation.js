import Discussion from '../../constants/Discussion'
import BaseDiscussion from './BaseDiscussion'
import InterceptDiscussion from './InterceptDiscussion'
import RemoveThreadPopUp from './RemoveThreadPopUp'
import ThreadDetails from './ThreadDetail'
import Field from '../../constants/Field'

class ThreadOperation extends BaseDiscussion {
  #removeThreadPopup = new RemoveThreadPopUp()
  #threadDetail = new ThreadDetails()

  constructor() {
    super()
  }

  removeThread() {
    InterceptDiscussion.itcRemoveThread.set()
    super.selectThreadThreeDotBy(Discussion.REMOVE)
    this.#removeThreadPopup.clickConfirm()
    InterceptDiscussion.itcRemoveThread.wait()
  }

  removeThreadIfExist(threadSubject) {
    cy.get('#recentThread').then(($threadList) => {
      const totalThreads = $threadList.find(`a.subject:contains('${threadSubject}')`).length
      if (totalThreads > 0) {
        super.setThreadSubject(threadSubject)
        for (let i = 0; i < totalThreads; i++) {
          this.removeThread()
        }
      }
    })
  }

  unSubscribeIfSubscribed() {
    super.getThreadViaSubject().within(($thread) => {
      cy.wrap($thread)
        .getDropdownMenu(Discussion.UNSUBSCRIBE)
        .then(($dropdown) => {
          if ($dropdown.find(`li > a:contains("${Discussion.UNSUBSCRIBE}")`).length) {
            super.selectThreadThreeDotBy(Discussion.UNSUBSCRIBE)
          }
        })
    })
  }

  upload(uploadFiles = {}) {
    const files = Object.entries(uploadFiles)
    if (files.length) {
      files.forEach((filePath) => {
        cy.intercept('POST', '**forum%2Fthread%2Fsave_file**').as('saveThreadFile')
        cy.get('.cw-dropzone-drop-area').attachFile(filePath[1], {
          encoding: 'utf-8',
          subjectType: 'drag-n-drop',
        })
        cy.wait('@saveThreadFile')
      })
    }
  }

  removeTags(tags = []) {
    cy.get('#tag-list').within(() => {
      tags.forEach((tag) => {
        cy.getElementWithLabel(tag, '.badge').within(() => {
          cy.get('a').click()
        })
      })
    })
  }

  removeAttachments(attachmentNames = []) {
    attachmentNames.forEach((attachmentName) => {
      cy.get('.cw-dropzone')
        .siblings('div.mt-3')
        .within(() => {
          cy.getElementWithLabel(attachmentName, '.text-ellipsis.text-break')
            .parents('.mb-3.d-flex')
            .within(() => {
              cy.get('.cec-pl-3 > a').click()
            })
        })
    })
  }

  createThread(thread) {
    super.clickNewThreadButton()
    this.fillingThreadData(thread)
    this.clickPublishButton(30000)
  }

  resetThread(oldThread, newThread) {
    cy.get('#recentThread, .category-detail').then(($recentThread) => {
      if ($recentThread.find(`a.subject:contains('${oldThread.subject}')`).length) {
        InterceptDiscussion.itcFetchCategory.set()
        this.setThreadSubject(oldThread.subject)
        super.selectThreadThreeDotBy(Discussion.EDIT)
        InterceptDiscussion.itcFetchCategory.wait()
        cy.waitLoadingOverlayNotExist()
        this.fillInSubject(newThread.subject)
        this.fillInDetail(newThread.detail)
        this.removeAttachments(oldThread.newAttachmentsName)
        this.upload(oldThread.removeAttachmentsPath)
        this.addTags(oldThread.removeTags)
        this.clickUpdateButton(10000)
      }
    })
  }

  editThread(oldThread, newThread) {
    InterceptDiscussion.itcFetchCategory.set()
    super.setThreadSubject(oldThread.subject)
    super.selectThreadThreeDotBy(Discussion.EDIT)
    InterceptDiscussion.itcFetchCategory.wait()
    cy.waitLoadingOverlayNotExist()
    this.fillingThreadData(newThread)
    this.removeAttachments(newThread.removeAttachments)
    this.removeTags(newThread.removeTags)
    this.upload(newThread.newAttachmentsPath)
    this.clickUpdateButton(10000)
  }

  replyThread(content) {
    cy.get('#commentBox')
      .eq(0)
      .within(() => {
        cy.typeInEditor(content)
        this.#threadDetail.clickReplyCommentButton()
      })
  }

  removeCommentIfExist(comment) {
    cy.get('.forum-detail').then(($forumDetail) => {
      if ($forumDetail.find(`.description:contains(${comment})`).length) {
        this.#threadDetail.getReplyBy(comment).each(($reply) => {
          InterceptDiscussion.itcFetchThreadComments.set()
          InterceptDiscussion.itcFetchThreadDetail.set()
          cy.wrap($reply).within(($comment) => {
            cy.wrap($comment).clickDropdownItem(Field.REMOVE)
          })
          this.#removeThreadPopup.clickConfirm()
          InterceptDiscussion.itcFetchThreadComments.wait()
          InterceptDiscussion.itcFetchThreadDetail.wait()
          cy.wait(1000)
        })
      }
    })
  }

  replyAndVerifyThreadComment(comment, username, threadSubject) {
    cy.wait(1000)
    this.#threadDetail._clickReplyThreadButton()
    cy.wait(1000)
    this.replyThread(comment)
    this.verifyThreadThreeDotOptions([Discussion.UNSUBSCRIBE])
    this.#threadDetail.verifyCommentIsExistInThread(comment, username)
    super.clickLeftSideBarBy(Discussion.MY_SUBSCRIPTIONS)
    super.verifyThreadSubject(threadSubject)
  }
}

export default ThreadOperation
