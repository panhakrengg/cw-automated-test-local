import MyLearningItc from '../intercepts/MyLearningItc'
import MyLearningQueries from '../queries/MyLearningQueries'

class MyLearningActions extends MyLearningQueries {
  #select75ItemsPerPage() {
    MyLearningItc.searchCourseCatalog.set()
    cy.selectItemPerPage(75)
    cy.waitLoadingOverlayNotExist()
    MyLearningItc.searchCourseCatalog.wait()
  }

  #clickButtonYesWithdraw() {
    MyLearningItc.withdrawBookedCourseInstance.set()
    super.getButtonWithdraw().click()
    MyLearningItc.withdrawBookedCourseInstance.wait()
  }

  #clickViewMyCourse(courseName) {
    MyLearningItc.fetchBookedCourseInfo.set()
    super.getCardCourse(courseName).within(() => {
      cy.get('.row .col-lg-1').within(($row) => {
        cy.wrap($row).clickDropdownItem('View my courses')
      })
    })
    MyLearningItc.fetchBookedCourseInfo.wait()
  }

  #clickLinkWithdraw(instanceName) {
    cy.swal2().within(() => {
      super.getLinkWithdraw(instanceName).click()
      this.#clickButtonYesWithdraw()
    })
  }

  withdrawCourse(courseName, instanceName) {
    this.#select75ItemsPerPage()
    this.#clickViewMyCourse(courseName)
    this.#clickLinkWithdraw(instanceName)
  }
}

export default MyLearningActions
