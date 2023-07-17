import InterceptReq from '../../../base/InterceptReq'
import ActivityLibraryActions from '../../../lms-admin/base/actions/ActivityLibraryActions'
import { OrgConst } from '../../../org-management/base-org-management/OrgStub'
import LmsAdminStub from '../setup-data/LmsAdminStub'

class SetUpActivities extends LmsAdminStub {
  #activityLibraryActions = new ActivityLibraryActions()
  itcSearchActivityLibrary = new InterceptReq('/activity_library/search', 'SearchActivityLibrary')

  getActivityLibraryCwUrl() {
    return '/web/full-catalog/activity-library'
  }

  getActivityLibraryOrgUrl() {
    return `${OrgConst.FIRE_CLOUD_FULL_CATALOG_URL}/activity-library`
  }

  getActivityLibraryCoPUrl(copAdminUrl) {
    return `${copAdminUrl}#_copMemberManagementPortlet_option=activity-library`
  }

  visitActivityLibraryOrg() {
    this.itcSearchActivityLibrary.set()
    cy.visit(this.getActivityLibraryOrgUrl())
    this.itcSearchActivityLibrary.wait()
  }
  visitActivityLibraryCW() {
    this.itcSearchActivityLibrary.set()
    cy.visit('/web/full-catalog/activity-library')
    this.itcSearchActivityLibrary.wait()
  }

  isActivityExist(title) {
    this.itcSearchActivityLibrary.wait()
    cy.get('.activity-library-wrapper').as('activityWrapper')

    cy.get('@activityWrapper').within(($wrapper) => {
      cy.inputByPlaceholder('Search', `"${title}"{enter}`)
      this.itcSearchActivityLibrary.wait()
      cy.waitLoadingOverlayNotExist()
      cy.wait(1000)
    })

    cy.get('@activityWrapper')
      .invoke('text')
      .then((text) => {
        cy.wrap(text.includes(title)).as('foundActivity')
      })
    return cy.get('@foundActivity')
  }

  createElearning(activity) {
    this.elearningObj = activity ? activity : this.elearningObj

    this.isActivityExist(this.elearningObj.title).then((foundActivity) => {
      if (!foundActivity) this.#activityLibraryActions.createNewELearningActivity(this.elearningObj)
    })
  }

  createRichText(activity) {
    this.richTextObj = activity ? activity : this.richTextObj

    this.isActivityExist(this.richTextObj.title).then((foundActivity) => {
      if (!foundActivity) this.#activityLibraryActions.createNewRichTextActivity(this.richTextObj)
    })
  }

  createFile(activity) {
    this.fileObj = activity ? activity : this.fileObj

    this.isActivityExist(this.fileObj.title).then((foundActivity) => {
      if (!foundActivity) this.#activityLibraryActions.createNewFileActivity(this.fileObj)
    })
  }

  createHyperlink(activity) {
    this.hyperlinkObj = activity ? activity : this.hyperlinkObj

    this.isActivityExist(this.hyperlinkObj.displayText).then((foundActivity) => {
      if (!foundActivity) this.#activityLibraryActions.createNewHyperLinkActivity(this.hyperlinkObj)
    })
  }

  createAssignment(activity) {
    this.isActivityExist(activity.assignmentName).then((foundActivity) => {
      if (!foundActivity) this.#activityLibraryActions.createNewAssignmentActivity(activity)
    })
  }
}
export default SetUpActivities
