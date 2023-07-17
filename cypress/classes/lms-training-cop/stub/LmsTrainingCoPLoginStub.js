import InterceptReq from '../../base/InterceptReq'
import SignInAs from '../../utilities/SignInAs'

class LmsTrainingCoPLoginStub {
  homeLearningUrl = '/u/home/learnings'
  #fetchCourseCatalog = new InterceptReq('/course_catalog/search', 'fetchCourseCatalog')
  itcFetchCourseCatalogActivities = new InterceptReq(
    '/course_catalog/course/activities',
    'fetchCourseCatalogActivities'
  )
  toMyLearningPageAsLearner() {
    this.#fetchCourseCatalog.set()
    SignInAs.copMember(this.homeLearningUrl)
    this.#fetchCourseCatalog.wait()
    cy.waitLoadingOverlayNotExist()
    Cypress.on('uncaught:exception', () => false)
  }
}

export default LmsTrainingCoPLoginStub
