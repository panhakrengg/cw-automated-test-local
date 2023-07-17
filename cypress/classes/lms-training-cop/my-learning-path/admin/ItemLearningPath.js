import { MyLearningPath } from '../../../constants/MyLearningPath'
import ItemLearningPathBase from './ItemLearningPathBase'

class ItemLearningPath extends ItemLearningPathBase {
  init() {
    this.initSideBarMenu()
    this.getBtnBack()
  }

  getBtnBack() {
    cy.get('div.d-none.cec-card__header a .cw-icon.text-black').as('backButton')
  }

  clickBack() {
    cy.get('@backButton').click()
  }

  initSideBarMenu() {
    cy.get('nav.cec-sidebar a').as(MyLearningPath.sideBar)
  }

  clickLearningPathOverview() {
    this.getSideBar().contains('Learning Path Overview').click()
  }

  clickEditLearningPath() {
    this.getSideBar().contains('Edit Learning Path').click()
  }

  clickCourses() {
    this.getSideBar().contains('Courses').click()
  }

  clickMembers() {
    this.getSideBar().contains('Members').click()
  }

  clickChangeLog() {
    this.getSideBar().contains('Change Log').click()
  }
}

export default ItemLearningPath
