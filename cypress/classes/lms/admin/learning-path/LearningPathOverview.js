import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'

class LearningPathOverview {
  #itcUpdateLearningPathStatus = new InterceptReq(
    '/learning_path/update_status',
    'UpdateLearningPathStatus'
  )
  #itcGetLearningPathDetail = new InterceptReq('/learning_path/get_detail', 'GetLearningPathDetail')
  _setFetchLearningPathDetail() {
    this.#itcGetLearningPathDetail.set()
  }
  _waitFetchLearningPathDetail() {
    this.#itcGetLearningPathDetail.wait()
  }
  getToggle() {
    return cy.cecCard().cardRightContent().find('.cw-toggle-button > label > input')
  }
  isPublished() {
    cy.wait(300) // Note: Invoke check immediately
    return this.getToggle().invoke('prop', 'checked')
  }
  unPublish() {
    this.isPublished().then(($isPublished) => {
      if ($isPublished) {
        this.clickToggleToUnpublish()
        this.#itcUpdateLearningPathStatus.set()
        cy.swal2Confirm(Field.YES_UN_PUBLISH).click()
        this.#itcUpdateLearningPathStatus.wait()
      }
    })
  }
  clickToggleToPublish() {
    this.getToggle().first().check({ force: true })
  }
  clickToggleToUnpublish() {
    this.getToggle().first().uncheck({ force: true })
  }
  verifyConfirmPublishPopup(hasCourse = true) {
    this.#itcUpdateLearningPathStatus.set()
    this.clickToggleToPublish()
    if (!hasCourse) {
      cy.swal2().verifySwal2Confirmation(
        'Would you like to publish this learning path without any courses?',
        '',
        Field.YES_PUBLISH,
        Field.CANCEL
      )
      this.clickToggleToPublish()
      cy.swal2Confirm(Field.YES_PUBLISH).click()
    }
    this.#itcUpdateLearningPathStatus.wait()
  }
  verifyConfirmUnpublishPopup() {
    this.#itcUpdateLearningPathStatus.set()
    this.clickToggleToUnpublish()
    cy.swal2().verifySwal2Confirmation(
      'Would you like to unpublish this learning path?',
      'Note: Unpublished learning paths cannot be searched or accessed by new learners. Only administrators can add new learners.',
      Field.YES_UN_PUBLISH,
      Field.REMAIN_PUBLISHED
    )
    this.clickToggleToUnpublish()
    cy.swal2Confirm(Field.YES_UN_PUBLISH).click()
    this.#itcUpdateLearningPathStatus.wait()
  }
}

export default LearningPathOverview
