import { Lms } from '../../../../constants/Lms'
import ManageCourseInstanceItc from '../intercepts/ManageCourseInstanceItc'
import CourseInstanceQueries from '../queries/CourseInstanceQueries'

class CourseInstanceActions extends CourseInstanceQueries {
  #clickSideBarItemByName(itemName) {
    super.getSideBar().within(() => {
      cy.getElementWithLabel(itemName, 'a').click()
    })
  }
  clickOpenInstanceOverview() {
    this.#clickSideBarItemByName(Lms.instanceOverview)
  }
  clickOpenEditInstance() {
    this.#clickSideBarItemByName(Lms.editInstance)
  }
  clickBackLinkIcon() {
    ManageCourseInstanceItc.itcFetchCourseInstances.set()
    cy.clickBackLink()
    cy.wait(3000)
    ManageCourseInstanceItc.itcFetchCourseInstances.wait()
  }
}

export default CourseInstanceActions
