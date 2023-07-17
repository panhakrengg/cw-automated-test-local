import { Lms } from '../../../../constants/Lms'
import LearningItc from '../intercepts/LearningItc'
import LearningQueries from '../queries/LearningQueries'

class LearningActions extends LearningQueries {
  visitLearning() {
    LearningItc.fetchCourseCatalog.set()
    cy.visit(super.getLearningUrl())
    LearningItc.fetchCourseCatalog.wait()
  }

  switchToCourseCatalog() {
    cy.getCwDropdown().within(($cwDropdown) => {
      LearningItc.fetchCourseCatalog.set()
      cy.wrap($cwDropdown).click()
      cy.wrap($cwDropdown).clickDropdownName(Lms.courseCatalog)
      LearningItc.fetchCourseCatalog.wait()
      cy.wait(1000)
      cy.waitLoadingOverlayNotExist()
    })
  }

  expandFilterByCategoryType(type) {
    super.getFilterToggle(type).within(($toggle) => {
      cy.wrap($toggle)
        .invoke('attr', 'class')
        .then(($class) => {
          const isExpanded = $class.includes('d-flex')
          if (!isExpanded) {
            cy.wrap($toggle).click()
          }
        })
    })
  }
}

export default LearningActions
